export const parseJSONList = <T>(params: string | string[] | undefined) => {
  if (Array.isArray(params)) {
    return params.map((param) => JSON.parse(param) as T);
  }

  if (!params) {
    return [];
  }

  return [JSON.parse(params) as T];
};

export const parseBodyArray = <T>(params: T | T[]) => {
  if (!params) {
    return [];
  }

  if (Array.isArray(params)) {
    return params;
  }

  return [params];
};

export const parseBooleanQuery = (value?: string) => {
  if (value === undefined) {
    return value;
  }

  return value === "true";
};

export const buildOrderParams = (
  orderBy: string | undefined,
  orderDirection: string | undefined
) => {
  const orderColumn = orderBy || "createdAt";
  const direction = ["ASC", "DESC"].includes(orderDirection || "")
    ? orderDirection
    : "DESC";

  return { [orderColumn]: direction };
};
