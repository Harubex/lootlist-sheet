const debug = true;

/**
 * Wraps logging statements in a debug check.
 * @param msg The data to log.
 */
export default function log(data: any) {
    if (debug) {
        Logger.log(data);
    }
}
