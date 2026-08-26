import { distillRangeLabel } from './distill-range-label';


const MIN = ['min', 'minimum'];
const MAX = ['max', 'maximum'];

describe('distillRangeLabel', () => {

  it('should distill a leading From/To', () => {
    expect(distillRangeLabel('From Create Date', 'To Create Date')).toBe('Create Date');
  });

  it('should distill a trailing from/to', () => {
    expect(distillRangeLabel('Next appointment from', 'Next appointment to'))
      .toBe('Next appointment');
  });

  it('should distill a from/to in the middle', () => {
    expect(distillRangeLabel('Tentative from date', 'Tentative to date')).toBe('Tentative date');
  });

  it('should keep a "to" that belongs to the name', () => {
    expect(distillRangeLabel('Fax to pharmacy from', 'Fax to pharmacy to')).toBe('Fax to pharmacy');
  });

  it('should ignore casing differences between the two ends', () => {
    expect(distillRangeLabel('From Received Date', 'To Received date')).toBe('Received Date');
  });

  it('should restore the capital the stripped word was carrying', () => {
    expect(distillRangeLabel('From billing month', 'To billing month')).toBe('Billing month');
  });

  it('should leave an already capitalized stem alone', () => {
    expect(distillRangeLabel('COI Expiry Date From', 'COI Expiry Date To')).toBe('COI Expiry Date');
  });

  it('should return null for labels that name unrelated ends', () => {
    expect(distillRangeLabel('Start', 'End')).toBeNull();
    expect(distillRangeLabel('Created', 'Expires')).toBeNull();
  });

  it('should return null when nothing is left of the label', () => {
    expect(distillRangeLabel('From', 'To')).toBeNull();
  });

  it('should return null when either label is missing', () => {
    expect(distillRangeLabel('From Date', undefined)).toBeNull();
    expect(distillRangeLabel(undefined, undefined)).toBeNull();
  });

  it('should distill min/max when told those are the end words', () => {
    expect(distillRangeLabel('Min Price', 'Max Price', MIN, MAX)).toBe('Price');
    expect(distillRangeLabel('Minimum speed', 'Maximum speed', MIN, MAX)).toBe('Speed');
    expect(distillRangeLabel('Min Range', 'Max Range', MIN, MAX)).toBe('Range');
  });

  it('should not read from/to as range ends, or the other way round', () => {
    expect(distillRangeLabel('Min Price', 'Max Price')).toBeNull();
    expect(distillRangeLabel('From Date', 'To Date', MIN, MAX)).toBeNull();
  });

});
