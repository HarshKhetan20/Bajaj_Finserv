function analyzeGraph(data) {
    const invalid_entries = [];
    const seenEdges = new Set();
    const duplicateEdgesSet = new Set();
    const validEdges = [];

    // 1 & 2 & 3. Input validation and Duplicate Edge Handling
    data.forEach(entry => {
        if (typeof entry !== 'string') {
            invalid_entries.push(entry);
            return;
        }
        
        const trimmed = entry.trim();
        const validRegex = /^[A-Z]->[A-Z]$/;
        
        if (!validRegex.test(trimmed)) {
            invalid_entries.push(trimmed);
            return;
        }

        const [u, v] = trimmed.split('->');
        if (u === v) { // Self-loop
            invalid_entries.push(trimmed);
            return;
        }

        if (seenEdges.has(trimmed)) {
            duplicateEdgesSet.add(trimmed);
        } else {
            seenEdges.add(trimmed);
            validEdges.push({str: trimmed, u, v});
        }
    });

    const duplicate_edges = Array.from(duplicateEdgesSet);

    // 4 & 5. Graph Building & Multi-Parent Rule
    const parents = {};
    const children = {};
    const all_nodes = new Set();

    validEdges.forEach(({str, u, v}) => {
        all_nodes.add(u);
        all_nodes.add(v);
        
        if (!children[u]) children[u] = [];
        if (!children[v]) children[v] = []; // Ensure every node has entry

        // Multi-parent rule: only first parent is valid
        if (!(v in parents)) {
            parents[v] = u;
            children[u].push(v);
        }
    });

    const nodesArray = Array.from(all_nodes).sort();
    const hierarchies = [];
    const unvisited = new Set(nodesArray);
    
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let max_tree_depth = -1;

    // Build tree recursively and compute depth
    function buildTreeAndDepth(n, treeVisited) {
        if (treeVisited.has(n)) return { tree: {}, depth: 0 };
        treeVisited.add(n);
        let obj = {};
        let currentMaxDepth = 1;
        
        children[n].forEach(child => {
            const childRes = buildTreeAndDepth(child, treeVisited);
            obj[child] = childRes.tree;
            currentMaxDepth = Math.max(currentMaxDepth, 1 + childRes.depth);
        });
        
        return { tree: obj, depth: currentMaxDepth };
    }

    // Process True Roots (in-degree 0)
    nodesArray.forEach(node => {
        if (!(node in parents)) { // In-degree 0
            const treeVisited = new Set();
            const { tree, depth } = buildTreeAndDepth(node, treeVisited);
            
            treeVisited.forEach(v => unvisited.delete(v));
            hierarchies.push({ root: node, tree: { [node]: tree }, depth });
            
            total_trees++;
            if (depth > max_tree_depth) {
                max_tree_depth = depth;
                largest_tree_root = node;
            } else if (depth === max_tree_depth && largest_tree_root !== null) {
                if (node < largest_tree_root) {
                    largest_tree_root = node;
                }
            }
        }
    });

    // Process Cycles for remaining unvisited nodes
    while (unvisited.size > 0) {
        const startNode = Array.from(unvisited).sort()[0];
        
        // Find the cycle by tracing parents
        let curr = startNode;
        const pathObj = {};
        let order = 0;
        
        while (!(curr in pathObj)) {
            pathObj[curr] = order++;
            curr = parents[curr];
        }
        
        // `curr` is the node where the cycle repeats
        const cycleStartIndex = pathObj[curr];
        const cycleNodes = Object.keys(pathObj).filter(k => pathObj[k] >= cycleStartIndex);
        
        // Lexicographically smallest node in cycle becomes root
        const root = cycleNodes.sort()[0];
        
        const treeVisited = new Set();
        const { tree } = buildTreeAndDepth(root, treeVisited);
        
        treeVisited.forEach(v => unvisited.delete(v));
        
        hierarchies.push({ root, tree: { [root]: tree }, has_cycle: true });
        total_cycles++;
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root: largest_tree_root || ""
        }
    };
}

module.exports = { analyzeGraph };
