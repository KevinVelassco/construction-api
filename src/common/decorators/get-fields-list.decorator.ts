import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type FieldsResult = {
  fields: string[];
  numberOfFields: number;
};

export const GetFiledsList = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();

    if (!Array.isArray(info.fieldNodes)) {
      return {
        fields: [],
        numberOfFields: 0,
      };
    }

    const selections = info.fieldNodes[0]?.selectionSet?.selections;

    const fields = selections?.map(({ name }) => name.value) ?? [];

    return {
      fields,
      numberOfFields: fields.length,
    };
  },
);
