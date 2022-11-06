const watchElementAttributeCallback = (
  attribute: string,
  onChange: () => void,
  mutationList: MutationRecord[]
) => {
  mutationList.forEach((mutation: MutationRecord) => {
    const { type: mutationType } = mutation;

    if (mutationType !== 'attributes') {
      return;
    }

    const { attributeName } = mutation;

    if (attributeName === attribute) {
      onChange();
    }
  });
}

export default watchElementAttributeCallback;
