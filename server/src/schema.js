import { makeExecutableSchema } from 'graphql-tools'
import _ from 'lodash/fp'

import * as InterfacesDefinitions from './interfaces/Definitions'
import * as ModulesDefinitions from './modules/Definitions'
import * as ScalarsDefinitions from './scalars/Definitions'
import * as TypesDefinitions from './types/Definitions'

const definitions = [
  InterfacesDefinitions,
  ModulesDefinitions,
  ScalarsDefinitions,
  TypesDefinitions,
]

const typeDefs = _.flatMap('typeDefs', definitions)

const resolvers = _.mergeAll(definitions.map(definition => definition.resolvers))

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
