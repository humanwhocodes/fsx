/**
 * @fileoverview The main file for the fsx package.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------

/** @typedef{import("@fsx/types").FsxImpl} FsxImpl */

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Error to represent when a method is missing on an impl.
 */
export class NoSuchMethodError extends Error {

    /**
     * Creates a new instance.
     * @param {string} methodName The name of the method that was missing.
     */ 
    constructor(methodName) {
        super(`Method "${methodName}" does not exist on impl.`);
    }
}

/**
 * Error to represent when an impl is already set.
 */
export class ImplAreadySetError extends Error {

    /**
     * Creates a new instance.
     */ 
    constructor() {
        super(`Implementation already set.`);
    }
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * A class representing a log entry.
 */
export class LogEntry {

    /**
     * The name of the method called.
     * @type {string}
     */
    methodName;

    /**
     * The arguments to the method.
     * @type {any[]}
     */
    args;

    /**
     * The time at which the log entry was created.
     * @type {number}
     */
    timestamp = Date.now();

    /**
     * Creates a new instance.
     * @param {string} methodName The name of the method called.
     * @param {any[]} args The arguments to the method.
     */
    constructor(methodName, args) {
        this.methodName = methodName;
        this.args = args;
    }
}

/**
 * A class representing a file system utility library.
 * @implements {FsxImpl}
 */
export class Fsx {

    /**
     * The base implementation for this instance.
     * @type {FsxImpl}
     */
    #baseImpl;

    /**
     * The current implementation for this instance.
     * @type {FsxImpl}
     */
    #impl;

    /**
     * A map of log names to their corresponding entries.
     * @type {Map<string,Array<LogEntry>>}
     */
    #logs = new Map();

    /**
     * Creates a new instance.
     * @param {object} options The options for the instance.
     * @param {FsxImpl} options.impl The implementation to use.
     */
    constructor({ impl }) {
        this.#baseImpl = impl;
        this.#impl = impl;
    }

    /**
     * Logs an entry onto all currently open logs.
     * @param {string} methodName The name of the method being called.
     * @param {...*} args The arguments to the method.
     * @returns {void}
     */
    #log(methodName, ...args) {
        for (const logs of this.#logs.values()) {
            logs.push(new LogEntry(methodName, args));
        }
    }
    
    /**
     * Starts a new log with the given name.
     * @param {string} name The name of the log to start;
     * @returns {void}
     * @throws {Error} When the log already exists.
     * @throws {TypeError} When the name is not a non-empty string.
     */
    logStart(name) {

        if (!name || typeof name !== "string") {
            throw new TypeError("Log name must be a non-empty string.");
        }

        if (this.#logs.has(name)) {
            throw new Error(`Log "${name}" already exists.`);
        }

        this.#logs.set(name, []);
    }

    /**
     * Ends a log with the given name and returns the entries.
     * @param {string} name The name of the log to end.
     * @returns {Array<LogEntry>} The entries in the log.
     * @throws {Error} When the log does not exist.
     */
    logEnd(name) {
        if (this.#logs.has(name)) {
            const logs = this.#logs.get(name);
            this.#logs.delete(name);
            return logs;
        }

        throw new Error(`Log "${name}" does not exist.`);
    }

    /**
     * Determines if the current implementation is the base implementation.
     * @returns {boolean} True if the current implementation is the base implementation.
     */
    isBaseImpl() {
        return this.#impl === this.#baseImpl;
    }

    /**
     * Sets the implementation for this instance.
     * @param {object} impl The implementation to use.
     * @returns {void}
     */
    setImpl(impl) {
        this.#log("implSet", impl);

        if (this.#impl !== this.#baseImpl) {
            throw new ImplAreadySetError();
        }

        this.#impl = impl;
    }

    /**
     * Resets the implementation for this instance back to its original.
     * @returns {void}
     */
    resetImpl() {
        this.#log("implReset");
        this.#impl = this.#baseImpl;
    }

    /**
     * Asserts that the given method exists on the current implementation.
     * @param {string} methodName The name of the method to check.
     * @returns {void}
     * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
     */
    #assertImplMethod(methodName) {
        if (typeof this.#impl[methodName] !== "function") {
            throw new NoSuchMethodError(methodName);
        }
    }

    /**
     * Calls the given method on the current implementation.
     * @param {string} methodName The name of the method to call.
     * @param {...any} args The arguments to the method.
     * @returns {any} The return value from the method.
     * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
     */
    #callImplMethod(methodName, ...args) {
        this.#log(methodName, ...args);
        this.#assertImplMethod(methodName);
        return this.#impl[methodName](...args);
    }

    /**
     * Reads the given file and returns the contents as text.
     * @param {string} filePath The file to read.
     * @returns {Promise<string>} The contents of the file.
     * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
     */
    async text(filePath) {
        return this.#callImplMethod("text", filePath);
    }

    /**
     * Reads the given file and returns the contents as JSON.
     * @param {string} filePath The file to read.
     * @returns {Promise<any>} The contents of the file as JSON.
     * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
     */
    async json(filePath) {
        return this.#callImplMethod("json", filePath);
    }

    /**
     * Reads the given file and returns the contents as an ArrayBuffer.
     * @param {string} filePath The file to read.
     * @returns {Promise<ArrayBuffer>} The contents of the file as an ArrayBuffer.
     * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
     */
    async arrayBuffer(filePath) {
        return this.#callImplMethod("arrayBuffer", filePath);
    }

    /**
     * Writes the given data to the given file.
     * @param {string} filePath The file to write.
     * @param {any} data The data to write.
     * @returns {Promise<void>} A promise that resolves when the file is written.
     * @throws {NoSuchMethodError} When the method does not exist on the current implementation.
     */
    async write(filePath, data) {
        return this.#callImplMethod("write", filePath, data);
    }

}