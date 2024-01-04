export const CLONE_PROPERTY = 'isClone';

export function isObjectClone(obj: any): boolean {
  return obj['isClone'] === true;
}
