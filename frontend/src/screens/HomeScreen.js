import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { ScrollView } from 'react-native'
import {
  Avatar, SearchBar, List, ListItem,
} from 'react-native-elements'

import { withAuthentication } from '../services'

const ProductCollectionQuery = gql`
  query ProductCollectionQuery {
    products {
      payload {
        id
        name
      }
      hasMore
    }
  }
`

const firstLetters = text => text.split(' ').map(word => word[0]).join('')

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
  }

  logout = async () => {
    await this.props.authentication.reset()
    this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <Query query={ProductCollectionQuery}>
        {({ data }) => (
          <>
            <SearchBar placeholder="Type here..." lightTheme />
            <ScrollView>
              <List>
                {data && data.products && data.products.payload.map(product => (
                  <ListItem
                    key={product.id}
                    avatar={(
                      <Avatar
                        title={firstLetters(product.name)}
                        rounded
                      />
                    )}
                    title={product.name}
                  />
                ))}
              </List>
            </ScrollView>
          </>
        )}
      </Query>
    )
  }
}

export default withAuthentication(HomeScreen)
