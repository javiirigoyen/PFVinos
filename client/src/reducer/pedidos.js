import { EDIT_STATUS_PEDIDO, GET_PEDIDOS, GET_PEDIDO_DETAIL, GET_PEDIDO_BY_USER, GET_PREF_ID } from '../actions/types';

const initialState = {
  allPedidos: [],
  filteredPedidos: [],
  pedidoDetail: null,
  userPedidos: [],
  pedidos: [],
  url: {}
}

export default function pedidosReducer (state = initialState, action) {

  const { type, payload } = action
    console.log(type)
  switch (type) {

      case GET_PEDIDO_BY_USER:
          console.log(type)
          return {
              ...state,
              userPedidos: payload
          }

    case EDIT_STATUS_PEDIDO:
      return {
        ...state
      }

    case GET_PEDIDOS:
      return {
        ...state,
        pedidos: action.payload
      }
      case GET_PREF_ID:
        console.log("reducer: ",action.payload.url)
        return {...state, url: action.payload.url}
    default:
      return { ...state }
  }
}
