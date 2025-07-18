import {
  upperRight,
  upperLeft,
  upperCenter,
  PositionAdjust,
} from '../getAdjustPositionData';

describe('getAdjustPositionData', () => {
  describe('upperRight', () => {
    it('returns correct position for index 0', () => {
      const result = upperRight(0);
      expect(result).toEqual({
        top: '0px',
        right: '0px',
        bottom: '',
        left: '',
      });
    });

    it('returns correct position for index 1', () => {
      const result = upperRight(1);
      expect(result).toEqual({
        top: '50px',
        right: '0px',
        bottom: '',
        left: '',
      });
    });

    it('returns correct position for index 2', () => {
      const result = upperRight(2);
      expect(result).toEqual({
        top: '100px',
        right: '0px',
        bottom: '',
        left: '',
      });
    });

    it('returns correct position for negative index', () => {
      const result = upperRight(-1);
      expect(result).toEqual({
        top: '-50px',
        right: '0px',
        bottom: '',
        left: '',
      });
    });

    it('returns correct position for large index', () => {
      const result = upperRight(10);
      expect(result).toEqual({
        top: '500px',
        right: '0px',
        bottom: '',
        left: '',
      });
    });

    it('returns PositionAdjust type', () => {
      const result = upperRight(0);
      expect(result).toHaveProperty('top');
      expect(result).toHaveProperty('right');
      expect(result).toHaveProperty('bottom');
      expect(result).toHaveProperty('left');
    });
  });

  describe('upperLeft', () => {
    it('returns correct position for index 0', () => {
      const result = upperLeft(0);
      expect(result).toEqual({
        top: '0px',
        right: '',
        bottom: '',
        left: '0px',
      });
    });

    it('returns correct position for index 1', () => {
      const result = upperLeft(1);
      expect(result).toEqual({
        top: '50px',
        right: '',
        bottom: '',
        left: '0px',
      });
    });

    it('returns correct position for index 2', () => {
      const result = upperLeft(2);
      expect(result).toEqual({
        top: '100px',
        right: '',
        bottom: '',
        left: '0px',
      });
    });

    it('returns correct position for negative index', () => {
      const result = upperLeft(-1);
      expect(result).toEqual({
        top: '-50px',
        right: '',
        bottom: '',
        left: '0px',
      });
    });

    it('returns correct position for large index', () => {
      const result = upperLeft(10);
      expect(result).toEqual({
        top: '500px',
        right: '',
        bottom: '',
        left: '0px',
      });
    });

    it('returns PositionAdjust type', () => {
      const result = upperLeft(0);
      expect(result).toHaveProperty('top');
      expect(result).toHaveProperty('right');
      expect(result).toHaveProperty('bottom');
      expect(result).toHaveProperty('left');
    });
  });

  describe('upperCenter', () => {
    it('returns correct position for index 0', () => {
      const result = upperCenter(0);
      expect(result).toEqual({
        top: '0px',
        right: '',
        bottom: '',
        left: '',
      });
    });

    it('returns correct position for index 1', () => {
      const result = upperCenter(1);
      expect(result).toEqual({
        top: '50px',
        right: '',
        bottom: '',
        left: '',
      });
    });

    it('returns correct position for index 2', () => {
      const result = upperCenter(2);
      expect(result).toEqual({
        top: '100px',
        right: '',
        bottom: '',
        left: '',
      });
    });

    it('returns correct position for negative index', () => {
      const result = upperCenter(-1);
      expect(result).toEqual({
        top: '-50px',
        right: '',
        bottom: '',
        left: '',
      });
    });

    it('returns correct position for large index', () => {
      const result = upperCenter(10);
      expect(result).toEqual({
        top: '500px',
        right: '',
        bottom: '',
        left: '',
      });
    });

    it('returns PositionAdjust type', () => {
      const result = upperCenter(0);
      expect(result).toHaveProperty('top');
      expect(result).toHaveProperty('right');
      expect(result).toHaveProperty('bottom');
      expect(result).toHaveProperty('left');
    });
  });

  describe('PositionAdjust interface', () => {
    it('should have correct structure', () => {
      const positionAdjust: PositionAdjust = {
        top: '0px',
        right: '0px',
        bottom: '',
        left: '',
      };

      expect(positionAdjust).toHaveProperty('top');
      expect(positionAdjust).toHaveProperty('right');
      expect(positionAdjust).toHaveProperty('bottom');
      expect(positionAdjust).toHaveProperty('left');
    });

    it('should allow different value types', () => {
      const positionAdjust: PositionAdjust = {
        top: 0,
        right: '10px',
        bottom: null,
        left: undefined,
      };

      expect(positionAdjust).toBeDefined();
    });
  });

  describe('function combinations', () => {
    it('should work with all functions in sequence', () => {
      const results = [upperRight(0), upperLeft(1), upperCenter(2)];

      expect(results).toHaveLength(3);
      expect(results[0].top).toBe('0px');
      expect(results[1].top).toBe('50px');
      expect(results[2].top).toBe('100px');
    });

    it('should handle edge cases', () => {
      const edgeCases = [
        upperRight(Number.MAX_SAFE_INTEGER),
        upperLeft(Number.MIN_SAFE_INTEGER),
        upperCenter(0),
      ];

      expect(edgeCases).toHaveLength(3);
      expect(edgeCases[0]).toBeDefined();
      expect(edgeCases[1]).toBeDefined();
      expect(edgeCases[2]).toBeDefined();
    });
  });
});
