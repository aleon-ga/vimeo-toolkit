
const getAutoGeneratedCaptionsFile = async (req, res) => {

    try {

        const { videos } = req.body;

        for (const video of videos) {

            console.log(`\nIterating over video ${video}...`);

        };
        
        res.status(200).json({ success: true });

    } catch (error) {
        
        console.error(error);

    };

}; //!GETAUTOGENERATEDCCFILE-END

module.exports = { getAutoGeneratedCaptionsFile };