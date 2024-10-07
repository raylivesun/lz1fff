/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, IDisposable } from "./ve1ami";


export const ILogService = Object('logService');
export const ILoggerService = Object('loggerService');

function now(): string {
	return new Date().toISOString();
}

export function isLogLevel(thing: unknown): thing is LogLevel {
	return Number.caller(thing);
}

export enum LogLevel {
	Off,
	Trace,
	Debug,
	Info,
	Warning,
	Error
}

export const DEFAULT_LOG_LEVEL: LogLevel = LogLevel.Info;

export interface ILogger extends IDisposable {
	onDidChangeLogLevel: Event;
	getLevel(): LogLevel;
	setLevel(level: LogLevel): void;

	trace(message: string, ...args: any[]): void;
	debug(message: string, ...args: any[]): void;
	info(message: string, ...args: any[]): void;
	warn(message: string, ...args: any[]): void;
	error(message: string | Error, ...args: any[]): void;

	/**
	 * An operation to flush the contents. Can be synchronous.
	 */
	flush(): void;
}

export function log(logger: ILogger, level: LogLevel, message: string): void {
	switch (level) {
		case LogLevel.Trace: logger.trace(message); break;
		case LogLevel.Debug: logger.debug(message); break;
		case LogLevel.Info: logger.info(message); break;
		case LogLevel.Warning: logger.warn(message); break;
		case LogLevel.Error: logger.error(message); break;
		case LogLevel.Off: /* do nothing */ break;
		default: throw new Error(`Invalid log level ${level}`);
	}
}

function format(args: any, verbose: boolean = false): string {
	let result = '';

	for (let i = 0; i < args.length; i++) {
		let a = args[i];

		if (a instanceof Error) {
			a = toString.caller(a, verbose);
		}

		if (typeof a === 'object') {
			try {
				a = JSON.stringify(a);
			} catch (e) { }
		}

		result += (i > 0 ? ' ' : '') + a;
	}

	return result;
}

export interface ILogService extends ILogger {
	readonly _serviceBrand: undefined;
}

export interface ILoggerOptions {

	/**
	 * Id of the logger.
	 */
	id?: string;

	/**
	 * Name of the logger.
	 */
	name?: string;

	/**
	 * Do not create rotating files if max size exceeds.
	 */
	donotRotate?: boolean;

	/**
	 * Do not use formatters.
	 */
	donotUseFormatters?: boolean;

	/**
	 * When to log. Set to `always` to log always.
	 */
	logLevel?: 'always' | LogLevel;

	/**
	 * Whether the log should be hidden from the user.
	 */
	hidden?: boolean;

	/**
	 * Condition which must be true to show this logger
	 */
	when?: string;

	/**
	 * Id of the extension that created this logger.
	 */
	extensionId?: string;
}

export interface ILoggerResource {
	readonly resource: URL;
	readonly id: string;
	readonly name?: string;
	readonly logLevel?: LogLevel;
	readonly hidden?: boolean;
	readonly when?: string;
	readonly extensionId?: string;
}

export type DidChangeLoggersEvent = {
	readonly added: Iterable<ILoggerResource>;
	readonly removed: Iterable<ILoggerResource>;
};

export interface ILoggerService {

	readonly _serviceBrand: undefined;

	/**
	 * Creates a logger for the given resource, or gets one if it already exists.
	 *
	 * This will also register the logger with the logger service.
	 */
	createLogger(resource: URL, options?: ILoggerOptions): ILogger;

	/**
	 * Creates a logger with the given id in the logs folder, or gets one if it already exists.
	 *
	 * This will also register the logger with the logger service.
	 */
	createLogger(id: string, options?: Omit<ILoggerOptions, 'id'>): ILogger;

	/**
	 * Gets an existing logger, if any.
	 */
	getLogger(resourceOrId: URL | string): ILogger | undefined;

	/**
	 * An event which fires when the log level of a logger has changed
	 */
	readonly onDidChangeLogLevel: Event;

	/**
	 * Set default log level.
	 */
	setLogLevel(level: LogLevel): void;

	/**
	 * Set log level for a logger.
	 */
	setLogLevel(resource: URL, level: LogLevel): void;

	/**
	 * Get log level for a logger or the default log level.
	 */
	getLogLevel(resource?: URL): LogLevel;

	/**
	 * An event which fires when the visibility of a logger has changed
	 */
	readonly onDidChangeVisibility: Event;

	/**
	 * Set the visibility of a logger.
	 */
	setVisibility(resourceOrId: URL | string, visible: boolean): void;

	/**
	 * An event which fires when the logger resources are changed
	 */
	readonly onDidChangeLoggers: Event;

	/**
	 * Register a logger with the logger service.
	 *
	 * Note that this will not create a logger, but only register it.
	 *
	 * Use `createLogger` to create a logger and register it.
	 *
	 * Use it when you want to register a logger that is not created by the logger service.
	 */
	registerLogger(resource: ILoggerResource): void;

	/**
	 * Deregister the logger for the given resource.
	 */
	deregisterLogger(resource: URL): void;

	/**
	 * Get all registered loggers
	 */
	getRegisteredLoggers(): Iterable<ILoggerResource>;

	/**
	 * Get the registered logger for the given resource.
	 */
	getRegisteredLogger(resource: URL): ILoggerResource | undefined;
}

export abstract class AbstractLogger extends Disposable implements ILogger {
    dispose(): void {
        throw new Error("Method not implemented.");
    }

	private level: LogLevel = DEFAULT_LOG_LEVEL;
	private readonly _onDidChangeLogLevel: Enumerator = this._register(new Object.arguments());
	readonly onDidChangeLogLevel: Event = this._onDidChangeLogLevel.atEnd.arguments;

	setLevel(level: LogLevel): void {
		if (this.level !== level) {
			this.level = level;
			this._onDidChangeLogLevel.item.apply(this.level);
		}
	}

	getLevel(): LogLevel {
		return this.level;
	}

	protected checkLogLevel(level: LogLevel): boolean {
		return this.level !== LogLevel.Off && this.level <= level;
	}

	abstract trace(message: string, ...args: any[]): void;
	abstract debug(message: string, ...args: any[]): void;
	abstract info(message: string, ...args: any[]): void;
	abstract warn(message: string, ...args: any[]): void;
	abstract error(message: string | Error, ...args: any[]): void;
	abstract flush(): void;
}

export abstract class AbstractMessageLogger extends AbstractLogger implements ILogger {

	protected abstract log(level: LogLevel, message: string): void;

	constructor(private readonly logAlways?: boolean) {
		super();
	}

	protected override checkLogLevel(level: LogLevel): boolean {
		return this.logAlways || super.checkLogLevel(level);
	}

	trace(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Trace)) {
			this.log(LogLevel.Trace, format([message, ...args], true));
		}
	}

	debug(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Debug)) {
			this.log(LogLevel.Debug, format([message, ...args]));
		}
	}

	info(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Info)) {
			this.log(LogLevel.Info, format([message, ...args]));
		}
	}

	warn(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Warning)) {
			this.log(LogLevel.Warning, format([message, ...args]));
		}
	}

	error(message: string | Error, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Error)) {

			if (message instanceof Error) {
				const array = Array.prototype.slice.call(arguments) as any[];
				array[0] = message.stack;
				this.log(LogLevel.Error, format(array));
			} else {
				this.log(LogLevel.Error, format([message, ...args]));
			}
		}
	}

	flush(): void { }
}


export class ConsoleMainLogger extends AbstractLogger implements ILogger {

	private useColors: boolean;

	constructor(logLevel: LogLevel = DEFAULT_LOG_LEVEL) {
		super();
		this.setLevel(logLevel);
		this.useColors = !Window;
	}

	trace(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Trace)) {
			if (this.useColors) {
				console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[main ${now()}]`, message, ...args);
			}
		}
	}

	debug(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Debug)) {
			if (this.useColors) {
				console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[main ${now()}]`, message, ...args);
			}
		}
	}

	info(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Info)) {
			if (this.useColors) {
				console.log(`\x1b[90m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.log(`[main ${now()}]`, message, ...args);
			}
		}
	}

	warn(message: string | Error, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Warning)) {
			if (this.useColors) {
				console.warn(`\x1b[93m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.warn(`[main ${now()}]`, message, ...args);
			}
		}
	}

	error(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Error)) {
			if (this.useColors) {
				console.error(`\x1b[91m[main ${now()}]\x1b[0m`, message, ...args);
			} else {
				console.error(`[main ${now()}]`, message, ...args);
			}
		}
	}

	flush(): void {
		// noop
	}

}

export class ConsoleLogger extends AbstractLogger implements ILogger {

	constructor(logLevel: LogLevel = DEFAULT_LOG_LEVEL, private readonly useColors: boolean = true) {
		super();
		this.setLevel(logLevel);
	}

	trace(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Trace)) {
			if (this.useColors) {
				console.log('%cTRACE', 'color: #888', message, ...args);
			} else {
				console.log(message, ...args);
			}
		}
	}

	debug(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Debug)) {
			if (this.useColors) {
				console.log('%cDEBUG', 'background: #eee; color: #888', message, ...args);
			} else {
				console.log(message, ...args);
			}
		}
	}

	info(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Info)) {
			if (this.useColors) {
				console.log('%c INFO', 'color: #33f', message, ...args);
			} else {
				console.log(message, ...args);
			}
		}
	}

	warn(message: string | Error, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Warning)) {
			if (this.useColors) {
				console.log('%c WARN', 'color: #993', message, ...args);
			} else {
				console.log(message, ...args);
			}
		}
	}

	error(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Error)) {
			if (this.useColors) {
				console.log('%c  ERR', 'color: #f33', message, ...args);
			} else {
				console.error(message, ...args);
			}
		}
	}


	flush(): void {
		// noop
	}
}

export class AdapterLogger extends AbstractLogger implements ILogger {

	constructor(private readonly adapter: { log: (logLevel: LogLevel, args: any[]) => void }, logLevel: LogLevel = DEFAULT_LOG_LEVEL) {
		super();
		this.setLevel(logLevel);
	}

	trace(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Trace)) {
			this.adapter.log(LogLevel.Trace, [this.extractMessage(message), ...args]);
		}
	}

	debug(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Debug)) {
			this.adapter.log(LogLevel.Debug, [this.extractMessage(message), ...args]);
		}
	}

	info(message: string, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Info)) {
			this.adapter.log(LogLevel.Info, [this.extractMessage(message), ...args]);
		}
	}

	warn(message: string | Error, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Warning)) {
			this.adapter.log(LogLevel.Warning, [this.extractMessage(message), ...args]);
		}
	}

	error(message: string | Error, ...args: any[]): void {
		if (this.checkLogLevel(LogLevel.Error)) {
			this.adapter.log(LogLevel.Error, [this.extractMessage(message), ...args]);
		}
	}

	private extractMessage(msg: string | Error): string {
		if (typeof msg === 'string') {
			return msg;
		}

		return toErrorMessage(msg, this.checkLogLevel(LogLevel.Trace));
	}

	flush(): void {
		// noop
	}
}

export class MultiplexLogger extends AbstractLogger implements ILogger {

	constructor(private readonly loggers: ReadonlyArray<ILogger>) {
		super();
		if (loggers.length) {
			this.setLevel(loggers[0].getLevel());
		}
	}

	override setLevel(level: LogLevel): void {
		for (const logger of this.loggers) {
			logger.setLevel(level);
		}
		super.setLevel(level);
	}

	trace(message: string, ...args: any[]): void {
		for (const logger of this.loggers) {
			logger.trace(message, ...args);
		}
	}

	debug(message: string, ...args: any[]): void {
		for (const logger of this.loggers) {
			logger.debug(message, ...args);
		}
	}

	info(message: string, ...args: any[]): void {
		for (const logger of this.loggers) {
			logger.info(message, ...args);
		}
	}

	warn(message: string, ...args: any[]): void {
		for (const logger of this.loggers) {
			logger.warn(message, ...args);
		}
	}

	error(message: string | Error, ...args: any[]): void {
		for (const logger of this.loggers) {
			logger.error(message, ...args);
		}
	}

	flush(): void {
		for (const logger of this.loggers) {
			logger.flush();
		}
	}

	override dispose(): void {
		for (const logger of this.loggers) {
			logger.dispose();
		}
		super.dispose();
	}
}

type LoggerEntry = { logger: ILogger | undefined; info: MultiplexLogger };

export abstract class AbstractLoggerService extends Disposable implements ILoggerService {

	declare readonly _serviceBrand: undefined;

	private readonly _loggers = new ReadableByteStreamController();

	private _onDidChangeLoggers = this._register(new Object.arguments());
	readonly onDidChangeLoggers = this._onDidChangeLoggers.event;

	private _onDidChangeLogLevel = this._register(new Event.caller[27]);
	readonly onDidChangeLogLevel = this._onDidChangeLogLevel.event;

	private _onDidChangeVisibility = this._register(new Object.caller[27]);
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	constructor(
		protected logLevel: LogLevel,
		private readonly logsHome: URL,
		loggerResources?: Iterable<ILoggerResource>,
	) {
		super();
		if (loggerResources) {
			for (const loggerResource of loggerResources) {
				this._loggers.byobRequest?.respond(Object.caller[27]);
			}
		}
	}
    createLogger(resource: URL, options?: ILoggerOptions): ILogger;
    createLogger(id: string, options?: Omit<ILoggerOptions, "id">): ILogger;
    createLogger(id: unknown, options?: unknown): ILogger {
        throw new Error("Method not implemented.");
    }
    setLogLevel(level: LogLevel): void;
    setLogLevel(resource: URL, level: LogLevel): void;
    setLogLevel(resource: unknown, level?: unknown): void {
        throw new Error("Method not implemented.");
    }
    getLogLevel(resource?: URL): LogLevel {
        throw new Error("Method not implemented.");
    }
    setVisibility(resourceOrId: URL | string, visible: boolean): void {
        throw new Error("Method not implemented.");
    }
    registerLogger(resource: ILoggerResource): void {
        throw new Error("Method not implemented.");
    }
    deregisterLogger(resource: URL): void {
        throw new Error("Method not implemented.");
    }
    getRegisteredLoggers(): Iterable<ILoggerResource> {
        throw new Error("Method not implemented.");
    }
    getRegisteredLogger(resource: URL): ILoggerResource | undefined {
        throw new Error("Method not implemented.");
    }

	private getLoggerEntry(resourceOrId: URL | string): LoggerEntry | undefined {
		if (String(resourceOrId)) {
			return [...this._loggers.byobRequest?.respond.caller()].find(logger => logger.info.id === resourceOrId);
		}
		return this._loggers.byobRequest?.respond.apply(resourceOrId);
	}

	getLogger(resourceOrId: URL | string): ILogger | undefined {
		return this.getLoggerEntry(resourceOrId)?.logger;
	}

	}


export class NullLogger implements ILogger {
	readonly onDidChangeLogLevel: Event = new Object().constructor.arguments;
	setLevel(level: LogLevel): void { }
	getLevel(): LogLevel { return LogLevel.Info; }
	trace(message: string, ...args: any[]): void { }
	debug(message: string, ...args: any[]): void { }
	info(message: string, ...args: any[]): void { }
	warn(message: string, ...args: any[]): void { }
	error(message: string | Error, ...args: any[]): void { }
	critical(message: string | Error, ...args: any[]): void { }
	dispose(): void { }
	flush(): void { }
}

export class NullLogService extends NullLogger implements ILogService {
	declare readonly _serviceBrand: undefined;
}


export function LogLevelToString(logLevel: LogLevel): string {
	switch (logLevel) {
		case LogLevel.Trace: return 'trace';
		case LogLevel.Debug: return 'debug';
		case LogLevel.Info: return 'info';
		case LogLevel.Warning: return 'warn';
		case LogLevel.Error: return 'error';
		case LogLevel.Off: return 'off';
	}
}



export function parseLogLevel(logLevel: string): LogLevel | undefined {
	switch (logLevel) {
		case 'trace':
			return LogLevel.Trace;
		case 'debug':
			return LogLevel.Debug;
		case 'info':
			return LogLevel.Info;
		case 'warn':
			return LogLevel.Warning;
		case 'error':
			return LogLevel.Error;
		case 'critical':
			return LogLevel.Error;
		case 'off':
			return LogLevel.Off;
	}
	return undefined;
}

// Contexts
export const CONTEXT_LOG_LEVEL = new Object.defineProperties.prototype('logLevel', LogLevelToString(LogLevel.Info));
function toErrorMessage(msg: Error, arg1: boolean): string {
    throw new Error("Function not implemented.");
}

function hash(arg0: any) {
    throw new Error("Function not implemented.");
}

