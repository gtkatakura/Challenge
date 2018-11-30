import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { gql } from 'apollo-boost'
import { ActivityIndicator, FlatList } from 'react-native'
import {
  Avatar, SearchBar, ListItem,
} from 'react-native-elements'
import _ from 'lodash/fp'

import { withAuthentication } from '../../services'

const ProductCollectionQuery = gql`
  query ProductCollectionQuery($search: String, $after: ID) {
    products(search: $search, after: $after) {
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

  state = {
    search: '',
    products: {
      payload: [],
    },
    loadingMore: false,
  }

  logout = async () => {
    await this.props.authentication.reset()
    this.props.navigation.navigate('Auth')
  }

  initialLoad = async () => {
    const { data: { products } } = await this.props.client.query({
      query: ProductCollectionQuery,
      variables: {
        search: this.state.search,
      },
    })

    this.setState({
      products,
    })
  }

  updateSearch = _.debounce(100, (search) => {
    this.setState({ search }, this.initialLoad)
  })

  loadMore = async () => {
    if (!this.state.products.hasMore || this.state.loadingMore) {
      return
    }

    this.setState({
      loadingMore: true,
    })

    const lastProduct = _.last(this.state.products.payload)

    const { data: { products } } = await this.props.client.query({
      query: ProductCollectionQuery,
      variables: {
        search: this.state.search,
        after: lastProduct.id,
      },
    })

    this.setState(prevState => ({
      products: {
        ...products,
        payload: [
          ...prevState.products.payload,
          ...products.payload,
        ],
      },
    }))

    this.setState({
      loadingMore: false,
    })
  }

  componentDidMount() {
    this.initialLoad()
  }

  render() {
    return (
      <>
        <SearchBar
          onChangeText={this.updateSearch}
          placeholder="Type here..."
          lightTheme
        />
        <FlatList
          data={this.state.products.payload}
          keyExtractor={_.get('id')}
          renderItem={({ item: product }) => (
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
          )}
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => this.state.loadingMore && (
            <ActivityIndicator size="large" animating />
          )}
        />
      </>
    )
  }
}

export default withApollo(withAuthentication(HomeScreen))
