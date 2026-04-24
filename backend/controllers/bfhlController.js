const { analyzeGraph } = require('../utils/graphAnalyzer');

exports.processGraphData = (req, res) => {
    try {
        const inputData = req.body.data;
        if (!inputData || !Array.isArray(inputData)) {
            return res.status(400).json({ error: "Invalid input format. Expected an object with a 'data' array." });
        }

        const analysisResult = analyzeGraph(inputData);

        const response = {
            user_id: "harshkhetan421",
            email_id: "hk9677@srmist.edu.in",
            college_roll_number: "RA2311026010421",
            hierarchies: analysisResult.hierarchies,
            invalid_entries: analysisResult.invalid_entries,
            duplicate_edges: analysisResult.duplicate_edges,
            summary: analysisResult.summary
        };

        res.json(response);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
