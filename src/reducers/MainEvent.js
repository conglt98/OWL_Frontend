export const SET_PEEK_VIDEO = 'SET_PEEK_VIDEO';

export const setPeekVideo = peekVideo =>({
    type:SET_PEEK_VIDEO,
    peekVideo,
})

export default function reducer(state = {
        peekVideo:{},
}, action) {
    switch (action.type) {
        case SET_PEEK_VIDEO:
            return{
                ...state,
                peekVideo:action.peekVideo,
            };
        default:
            return state;
    }
}