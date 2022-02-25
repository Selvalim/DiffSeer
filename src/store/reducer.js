const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_UNFOLDDAY': {
            const { unfoldDay } = state
            console.log(unfoldDay)
            return {
                ...state,
                unfoldDay: [...unfoldDay,action.payload],
            };
        }
        case 'DELETE_UNFOLDDAY': {
            const { unfoldDay } = state
            return {
                ...state,
                unfoldDay:unfoldDay.filter((item)=>item!==action.payload), 
            };
        }
        case 'UPDATE_UNFOLDDAY': {
            const { unfoldDay,unfoldDiff } = state
            console.log(unfoldDay)
            if(unfoldDay.includes(action.payload)){
                if(unfoldDiff.includes(action.payload)){
                    return {
                        ...state,
                        unfoldDiff:unfoldDiff.filter((item)=>item!==action.payload),
                        // needOrder:true,
                    };
                }else{
                    return {
                        ...state,
                        unfoldDay:unfoldDay.filter((item)=>item!==action.payload),
                        unfoldDiff:unfoldDiff.filter((item)=>item!==action.payload),
                        // needOrder:true,
                    };
                }
            }else{
                return {
                    ...state,
                    unfoldDay: [...unfoldDay,action.payload],
                    // needOrder:true,
                };
            }

        }
        case 'UPDATE_UNFOLDDIFF': {
            const { unfoldDiff,unfoldDay } = state
            console.log(unfoldDiff)
            if(unfoldDay.includes(action.payload)){
                if(unfoldDiff.includes(action.payload)){
                    return {
                        ...state,
                        unfoldDiff:unfoldDiff.filter((item)=>item!==action.payload), 
                        unfoldDay:unfoldDay.filter((item)=>item!==action.payload), 
                        // needOrder:true,
                    };
                }else{
                    return {
                        ...state,
                        unfoldDiff: [...unfoldDiff,action.payload], 
                        // needOrder:true,
                    };
                }

            }else{
                return {
                    ...state,
                    unfoldDiff: [...unfoldDiff,action.payload],
                    unfoldDay: [...unfoldDay,action.payload],
                    // needOrder:true,
                };
            }

        }
        case 'UPDATE_TIMESPAN': {
            console.log('timespan',action.payload)
            return {
                ...state,
                timeSpan: action.payload,
                // nodeOrder:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
                focusSpan:['start','end'],
                unfoldDay:[],
                unfoldDiff:[],
                needOrder:false,
                unfoldSwitch:true,
                edgeReorder:false,
                MSVorder:false,
            };
        }
        case 'UPDATE_NEEDORDER': {
            console.log('NEEDORDER',action.payload)
            return {
                ...state,
                needOrder: action.payload,
            };
        }
        case 'UPDATE_FOCUSSPAN': {
            console.log('FUCUSspan',action.payload)
            return {
                ...state,
                focusSpan: action.payload,
                MSVorder:true,
                needOrder:false,
            };
        }
        case 'UPDATE_LOCATION': {
            console.log(action.payload)
            return {
                ...state,
                location: action.payload,
            };
        }
        case 'UPDATE_UNFOLDSWITCH': {
            console.log('UNFOLD SWITHC',action.payload)
            return {
                ...state,
                unfoldSwitch: action.payload,
            };
        }
        case 'UPDATE_EDGEREORDER': {
            console.log('EDGE ORDER',action.payload)
            return {
                ...state,
                edgeReorder: action.payload,
            };
        }
        case 'UPDATE_NODEORDER': {
            console.log(action.payload)
            return {
                ...state,
                nodeOrder: action.payload,
                needOrder:false,
                MSVorder:false
            };
        }
        case 'UPDATE_STREAMSWITCH': {
            console.log('stream',action.payload)
            return {
                ...state,
                streamSwitch: action.payload,
            };
        }
        case 'RESET': {
            console.log(action.payload)
            return {
                ...state,
                unfoldDay:[],
                unfoldDiff:[],
            };
        }
        default:
            return state;
    }
};

export default reducer;
