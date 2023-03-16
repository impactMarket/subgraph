
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	generates: {
		"generated-types/index.ts": {
			config: {
				avoidOptionals: true,
				scalars: {
					BigDecimal: "string",
					Bytes: "string",
				},
				skipTypename: true,
				useTypeImports: true,
			},
			plugins: ["typescript"],
		}
	},
	overwrite: true,
	schema: "./schema.graphql",
};

export default config;
