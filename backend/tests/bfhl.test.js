const request = require('supertest');
const app = require('../index');

describe('POST /bfhl Edge Cases', () => {
    it('Should correctly find independent trees and evaluate deep nested structures', async () => {
        const res = await request(app)
            .post('/bfhl')
            .send({ data: ["A->B", "A->C", "B->D", "X->Y"] });
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.summary.total_trees).toEqual(2);
        expect(res.body.summary.largest_tree_root).toEqual("A");
        expect(res.body.duplicate_edges).toEqual([]);
        expect(res.body.invalid_entries).toEqual([]);
    });

    it('Should correctly find and mark cycles, but still evaluate trees', async () => {
        const res = await request(app)
            .post('/bfhl')
            .send({ data: ["A->B", "B->C", "C->A", "X->Y"] });
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.summary.total_trees).toEqual(1);
        expect(res.body.summary.total_cycles).toEqual(1);
        expect(res.body.summary.largest_tree_root).toEqual("X");
        
        const cycle = res.body.hierarchies.find(h => h.has_cycle);
        expect(cycle).toBeDefined();
        // Since A, B, C are in a cycle, 'A' is lexicographically smallest.
        expect(cycle.root).toEqual("A"); 
    });

    it('Should correctly handle invalid and duplicate entries', async () => {
        const res = await request(app)
            .post('/bfhl')
            .send({ data: ["A->B", "A->B", "A->B", "1-2", "A->A", "AB->C"] });
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.duplicate_edges).toEqual(["A->B"]);
        expect(res.body.invalid_entries).toEqual(["1-2", "A->A", "AB->C"]);
        expect(res.body.summary.total_trees).toEqual(1);
    });

    it('Should correctly enforce the multi-parent rule', async () => {
        // According to the multi parent rule, only the *first* parent is valid
        const res = await request(app)
            .post('/bfhl')
            .send({ data: ["A->D", "B->D"] });
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.summary.total_trees).toEqual(2); // A->D is a tree, B is left alone (B has no children since B->D is ignored)
        expect(res.body.hierarchies.some(h => h.root === 'B' && Object.keys(h.tree).length === 0)).toBeTruthy();
    });
});
