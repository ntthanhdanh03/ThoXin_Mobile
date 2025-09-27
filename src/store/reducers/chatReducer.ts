import * as types from '../types';

interface IState {
  loading: boolean;
  chatRoom?: any[] | null;
  messages?: any[] | null;
}

interface IAction {
  type: string;
  payload: any;
  callback?: () => void;
}

const initialState: IState = {
  loading: false,
  chatRoom: null,
  messages: null,
};

const chatReducer = (state = initialState, action: IAction): IState => {
  switch (action.type) {
    case types.GET_CHAT_BY_ORDER: {
      return { ...state, loading: true };
    }
    case types.GET_CHAT_BY_ORDER + types.SUCCESS: {
      return {
        ...state,
        loading: false,
        chatRoom: action.payload,
      };
    }

    case types.GET_MESSAGE: {
      return { ...state, loading: true };
    }
    case types.GET_MESSAGE + types.SUCCESS: {
      return {
        ...state,
        loading: false,
        messages: action.payload,
      };
    }

    default:
      return state;
  }
};

export default chatReducer;
