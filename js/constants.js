
// An object describing filters to apply to webRequest events.
const NETWORK_FILTERS = {
    urls: ["<all_urls>"], /* An array of match patterns. The listener will only be called for requests whose targets match any of the given patterns. Only requests made using HTTP or HTTPS will trigger events, other protocols (such as data: and file:) supported by pattern matching do not trigger events. */
};

export {
    NETWORK_FILTERS
}