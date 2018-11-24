import _ from 'lodash/fp'

export const applyInterceptor = (interceptor, type) => _.mapValues((resolver) => {
  if (_.isPlainObject(resolver)) {
    return applyInterceptor(interceptor, resolver)
  }

  return (...args) => {
    interceptor(...args)
    return resolver(...args)
  }
}, type)
