import { describe, it, expect } from 'vitest'
import { getNextPose, mirrorDebt } from './flow'

describe('flow', () => {
    it('should never reach a mirror debt of 2 for any pose', () => {

        // Run 1000 iterations
        for (let i = 0; i < 1000; i++) {
            getNextPose()

            // Validate after each pose selection
            for (const [pose, debt] of Object.entries(mirrorDebt)) {
                expect(debt).toBeLessThan(2)
            }
        }
    })
})