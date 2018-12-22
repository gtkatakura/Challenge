const merge = (left, right) => Object.assign(left, right)

const toFormError = ({ path, message }) => ({ [path]: [message] })

const toFormErrors = errors => errors.map(toFormError).reduce(merge, {})

export default toFormErrors
