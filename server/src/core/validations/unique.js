export const unique = async (columnName, record, { Model }) => {
  if (!record[columnName]) {
    return null
  }

  const where = {
    [columnName]: record[columnName],
    ...(record.id ? {
      _id: { $ne: record.id },
    } : {}),
  }

  if (await Model.findOne(where)) {
    return {
      type: 'unique',
      path: [columnName],
      message: 'has already been taken',
      context: {
        key: columnName,
        label: columnName,
      },
    }
  }

  return null
}
