/**
 * Validates the edit action for embed domains based on the action parameter in the request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} Throws an error if the action parameter is not valid.
 */
const validateEditAction = (req, res, next) => {

    try {

        const { action } = req.params;

        /**
         * Define the mapping of actions to corresponding embed domain edit options.
         * @type {Object}
         * @prop {string} overwrite - This field overwrites existing domains.
         * @prop {string} add - Add to an existing set of domains.
         * @prop {string} delete - Remove from an existing set of domains
         */
        const embedDomainsEditOptions = {
            overwrite: 'embed_domains',
            add: 'embed_domains_add',
            delete: 'embed_domains_delete'
        };

        /**
         * Get the embed domain edit action based on the provided action parameter.
         * @type {string}
         */
        const embedDomainsEditAction = embedDomainsEditOptions[action];

        if (!embedDomainsEditAction) {

            throw new Error(`The action param "${action}" is not valid.`, {
                cause: { statusCode: 400 }
            });

        }

        // Set the embed domain edit action in the response locals for later use
        res.locals.action = embedDomainsEditAction;

        next();

    } catch (error) {

        res.status(error.cause?.statusCode ?? 500).json({ message: error.message });

    }

};

module.exports = validateEditAction;
