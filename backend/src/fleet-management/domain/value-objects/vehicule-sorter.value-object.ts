export class VehiculeSorter {
  constructor(
    public readonly field: string,
    public readonly direction: 'ASC' | 'DESC',
  ) {}

  static create(field: string, direction: 'ASC' | 'DESC'): VehiculeSorter {
    return new VehiculeSorter(field, direction);
  }
}
