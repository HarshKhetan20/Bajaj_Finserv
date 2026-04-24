const { analyzeGraph } = require('./utils/graphAnalyzer');

const testCases = [
    {
        name: "Normal Tree",
        data: ["A->B", "A->C", "B->D"]
    },
    {
        name: "Cycle Example",
        data: ["A->B", "B->C", "C->A"]
    },
    {
        name: "Invalid Entries",
        data: ["1->2", "AB->C", "A->A", "A-B", "hello"]
    },
    {
        name: "Duplicate Edges",
        data: ["X->Y", "X->Y", "X->Y"]
    },
    {
        name: "Multi-parent Rule",
        data: ["A->D", "B->D"]
    },
    {
        name: "Complex Disconnected",
        data: ["A->B", "B->C", "X->Y", "Y->Z", "Z->X", "U->V", "W->V"]
    }
];

testCases.forEach(tc => {
    console.log(`\n--- Test Case: ${tc.name} ---`);
    console.log(JSON.stringify(analyzeGraph(tc.data), null, 2));
});
