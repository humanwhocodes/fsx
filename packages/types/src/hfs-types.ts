/**
 * @fileoverview The types file for the hfs package.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// HfsImpl
//------------------------------------------------------------------------------

export interface HfsImpl {
	/**
	 * Reads the given file and returns the contents as text. Assumes the file is UTF-8 encoded.
	 * @param filePath The file to read.
	 * @returns The contents of the file or undefined if the file is empty.
	 */
	text?(filePath: string|URL): Promise<string|undefined>;

	/**
	 * Reads the given file and returns the contents as JSON. Assumes the file is UTF-8 encoded.
	 * @param filePath The file to read.
	 * @returns The contents of the file as JSON or undefined if the file is empty.
	 */
	json?(filePath: string|URL): Promise<any|undefined>;

	/**
	 * Reads the given file and returns the contents as an ArrayBuffer.
	 * @param filePath The file to read.
	 * @returns The contents of the file as an ArrayBuffer or undefined if the file is empty.
	 * @deprecated Use bytes() instead.
	 */
	arrayBuffer?(filePath: string|URL): Promise<ArrayBuffer|undefined>;

	/**
	 * Reads the given file and returns the contents as an Uint8Array.
	 * @param filePath The file to read.
	 * @returns The contents of the file as a Uint8Array or undefined if the file is empty.
	 */
	bytes?(filePath: string|URL): Promise<Uint8Array|undefined>;

	/**
	 * Writes the given data to the given file. For text, assumes UTF-8 encoding.
	 * @param filePath The file to write to.
	 * @param data The data to write.
	 * @returns A promise that resolves when the file is written.
	 * @throws {Error} If the file cannot be written.
	 */
	write?(filePath: string|URL, data: string|ArrayBuffer|ArrayBufferView): Promise<void>;

	/**
	 * Checks if the given file exists.
	 * @param filePath The file to check.
	 * @returns True if the file exists, false if not.
	 * @throws {Error} If the operation fails with a code other than ENOENT.
	 */
	isFile?(filePath: string|URL): Promise<boolean>;

	/**
	 * Checks if the given directory exists.
	 * @param dirPath The directory to check.
	 * @returns True if the directory exists, false if not.
	 * @throws {Error} If the operation fails with a code other than ENOENT.
	 */
	isDirectory?(dirPath: string|URL): Promise<boolean>;

	/**
	 * Creates the given directory, including any necessary parents.
	 * @param dirPath The directory to create.
	 * @returns A promise that resolves when the directory is created.
	 * @throws {Error} If the directory cannot be created.
	 */
	createDirectory?(dirPath: string|URL): Promise<void>;

	/**
	 * Deletes the given file or empty directory.
	 * @param fileOrDirPath The file or directory to delete.
	 * @returns A promise that resolves when the file or directory is deleted.
	 * @throws {Error} If the file or directory cannot be deleted.
	 */
	delete?(fileOrDirPath: string|URL): Promise<void>;

	/**
	 * Deletes the given file or directory recursively.
	 * @param fileOrDirPath The file or directory to delete.
	 * @returns A promise that resolves when the file or directory is deleted.
	 * @throws {Error} If the file or directory cannot be deleted.
	 */
	deleteAll?(fileOrDirPath: string|URL): Promise<void>;

	/**
	 * Returns a list of directory entries for the given path.
	 * @param dirPath The path to the directory to read.
	 * @returns A promise that resolves with the
	 *   directory entries.
	 * @throws {TypeError} If the directory path is not a string.
	 * @throws {Error} If the directory cannot be read.
	 */
	list?(dirPath: string|URL): AsyncIterable<HfsDirectoryEntry>;

	/**
	 * Returns the size of the given file.
	 * @param filePath The path to the file to check.
	 * @returns A promise that resolves with the size of the file in bytes or
	 * 		undefined if the file does not exist.
	 * @throws {Error} If the file cannot be read.
	 */
	size?(filePath: string|URL): Promise<number|undefined>;

	/**
	 * Copies the file from the source path to the destination path.
	 * @param fromPath The source file to copy.
	 * @param toPath The destination file to copy to.
	 * @returns A promise that resolves when the file is copied.
	 * @throws {Error} If the file cannot be copied.
	 */
	copy?(fromPath: string|URL, toPath: string|URL): Promise<void>;

	/**
	 * Copies a file or directory from one location to another.
	 * @param source The path to the file or directory to copy.
	 * @param destination The path to copy the file or directory to.
	 * @returns A promise that resolves when the file or directory is
	 * copied.
	 * @throws {Error} If the source file or directory does not exist.
	 * @throws {Error} If the source cannot be read.
	 */
	copyAll?(fromPath: string|URL, toPath: string|URL): Promise<void>;

	/**
	 * Moves a file from the source path to the destination path.
	 * @param source The location of the file to move.
	 * @param destination The destination of the file to move.
	 * @returns A promise that resolves when the file is moved.
	 * @throws {Error} If the source is a directory.
	 * @throws {Error} If the file cannot be moved.
	 */
	move?(source: string|URL, destination: string|URL): Promise<void>;
}

//------------------------------------------------------------------------------
// HfsDirEnt
//------------------------------------------------------------------------------

export interface HfsDirectoryEntry {

	/**
	 * The name of the file or directory.
	 */
	name: string;

	/**
	 * True if the entry is a directory, false if not.
	 */
	isDirectory: boolean;

	/**
	 * True if the entry is a file, false if not.
	 */
	isFile: boolean;

	/**
	 * True if the entry is a symbolic link, false if not.
	 */
	isSymlink: boolean;

}
