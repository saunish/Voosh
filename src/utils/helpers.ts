export function getSelectFields<TFields extends string | number | symbol>(
	allFields: TFields[],
	defaultExcludedFields: TFields[],
	includedFields: TFields[] | null = null,
	excludedFields: TFields[] | null = null,
): TFields[] {
	let fields = [...allFields];

	const exclusions = excludedFields || defaultExcludedFields;
	fields = fields.filter((field) => !exclusions.includes(field));

	if (includedFields) {
		fields = fields.filter((field) => includedFields.includes(field));
	}

	return fields;
}

export const safePromise = <T>(promise: Promise<T>): Promise<[null, T] | [Error, null]> =>
	promise.then((data) => [null, data] as [null, T]).catch((err) => [err instanceof Error ? err : new Error(String(err)), null]);

export function hasValue<T>(value: T | null | undefined): value is NonNullable<T> {
	if (value === null || value === undefined) return false;
	if (typeof value === 'string' && value.trim() === '') return false;
	if (Array.isArray(value) && value.length === 0) return false;
	if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return false;
	return true;
}
