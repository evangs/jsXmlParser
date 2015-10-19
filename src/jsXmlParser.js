jsXmlParser = {};

/**
 * Converts XML string to javascript object
 *
 * @param xml {String} XML string to be parsed
 *
 * @return {Object} javascript object representation of the XML
 */
jsXmlParser.parseXml = function parseXml(xml) {

    var obj = {};
    var i = 0;
    jsXmlParser._parseNode(xml, obj);

    // update array paths if available
    if (jsXmlParser.arrayPaths) {
        for (i = 0; i < jsXmlParser.arrayPaths.length; i++) {
            obj = jsXmlParser._validateArrayPath(jsXmlParser.arrayPaths[i], obj);
        }
    }

    return obj;
};

/**
 * Parses a node of XML and updates obj in place with parsed node
 *
 * @param node {String} XML node to be parsed
 * @param obj {Object} the javascript obj containing the parsed xml
 *
 * @return {Object} javascript object representation of the XML
 */
jsXmlParser._parseNode = function parseNode(node, obj) {

    var xmlNodeMatchRegex = /<([a-zA-Z0-9]*)(.*=".*")*?>((.|\s)*?)<\/\1>/g;
    var xmlNodeParamMatchRegex = /\s*(.*?)="(.*?)"/g;
    var nodes = node.match(xmlNodeMatchRegex);
    var parsedNode = [];
    var tmp = {};
    var i = 0;
    var params = [];
    var parsedParam = [];
    var l = 0;

    if (nodes) {
        for (i = 0; i < nodes.length; i++) {
            parsedNode = xmlNodeMatchRegex.exec(nodes[i]);

            // if a node with the same name already exists, convert to an array and push new object
            if (obj[parsedNode[1]]) {

                if (Array.isArray(obj[parsedNode[1]])) {
                    // if the existing object is already an array just push new object
                    obj[parsedNode[1]].push({});
                } else {
                    /* if the existing object is not an array, store it in a variable, create the
                     * array, push the existing object onto the array, and finally push a new object
                     * onto the array. */
                    tmp = {};
                    tmp = obj[parsedNode[1]];
                    obj[parsedNode[1]] = [];
                    obj[parsedNode[1]].push(tmp);
                    obj[parsedNode[1]].push({});
                }
            } else {
                // no object with this name exists, create new object
                obj[parsedNode[1]] = {};
            }

            // handle parameters
            if (parsedNode[2]) {
                params = parsedNode[2].match(xmlNodeParamMatchRegex) || [];
                for (i = 0; i < params.length; i++) {
                    parsedParam = xmlNodeParamMatchRegex.exec(params[i]);
                    if (Array.isArray(obj[parsedNode[1]])) {
                        l = obj[parsedNode[1]].length - 1;
                        obj[parsedNode[1]][l][parsedParam[1]] = parsedParam[2];
                    } else {
                        obj[parsedNode[1]][parsedParam[1]] = parsedParam[2];
                    }
                }
            }

            var moreNodes = parsedNode[3].match(xmlNodeMatchRegex);
            if (!moreNodes) {
                /* if there are no more nodes then we are at an endpoint and we need to add the
                 * value to the js object */

                // need to see if object is empty, if not then we need to create an array
                if (jsXmlParser._isEmpty(obj[parsedNode[1]])) {
                    obj[parsedNode[1]] = parsedNode[3];
                } else {
                    if (Array.isArray(obj[parsedNode[1]])) {
                        obj[parsedNode[1]].push(parsedNode[3]);
                    } else {
                        tmp = {};
                        tmp = obj[parsedNode[1]];
                        obj[parsedNode[1]] = [];
                        obj[parsedNode[1]].push(tmp);
                        obj[parsedNode[1]].push(parsedNode[3]);
                    }
                }

            } else {
                // if there are more nodes, process them recursively
                if (Array.isArray(obj[parsedNode[1]])) {
                    l = obj[parsedNode[1]].length - 1;
                    jsXmlParser._parseNode(parsedNode[3], obj[parsedNode[1]][l]);
                } else {
                    jsXmlParser._parseNode(parsedNode[3], obj[parsedNode[1]]);
                }
            }
        }
    }
};

/**
 * Function to test if we have an empty object
 *
 * @param obj {Object} object to test
 *
 * @return {Boolean} true if object is empty, false otherwise
 */
jsXmlParser._isEmpty = function isEmpty(obj) {
    for (var key in obj) {
        if (key) {
            return false;
        }
    }

    return true;
};

/**
 * updates an array path variable in the js object to be an array
 *
 * @param path {String} array path to validate
 * @param obj {Object} object to validate array path on
 *
 * @return {Object} updated js object
 */
jsXmlParser._validateArrayPath = function validateArrayPath(path, obj) {

    var parts = path.split('.');
    $360.log.debug('parts: ' + JSON.stringify(parts), 'jsXmlParser');
    obj = jsXmlParser._updateArray(parts, obj);

    return obj;
};

/**
 * updates an array path variable in the js object to be an array
 *
 * @param path {String} array path to validate
 * @param obj {Object} object to validate array path on
 *
 * @return {Object} updated js object
 */
jsXmlParser._updateArray = function updateArray(parts, obj) {
    if (parts.length) {
        var p = parts[0];
        var partsReset = [];
        parts.splice(0, 1);
        if (obj[p]) {

            // if its an earlier item in the array path that is an array we need to loop through each element
            if (parts.length && Array.isArray(obj[p])) {

                for (var i = 0; i < obj[p].length; i++) {
                	// create a copy of the node parts at this point so that we can reset it after each node update
                	partsReset = parts.slice();
                    obj[p][i] = jsXmlParser._updateArray(parts, obj[p][i]);
                    parts = partsReset;
                }

            // either last item in path or non array item in path
            } else {
                obj[p] = jsXmlParser._updateArray(parts, obj[p]);
            }
        }

    // last item in array path
    } else {

        // only update it to an array if it's not already an array
        if (!Array.isArray(obj)) {
            var t = obj;
            obj = [];
            obj.push(t);
        }
    }

    return obj;
};
