export const SET_ALL_EVENTS = 'SET_ALL_EVENTS';

export const SET_COMBO_BOX = 'SET_COMBO_BOX';

export const SET_CURRENT_EVENT = 'SET_CURRENT_EVENT';
export const SET_DEL_DOMAIN = 'SET_DEL_DOMAIN';
export const SET_DEL_PROFILE = 'SET_DEL_PROFILE';
export const SET_DEL_TIER = 'SET_DEL_TIER'
export const SET_DEL_RULE = 'SET_DEL_RULE'


export const SET_EDIT_CONDITION = 'SET_EDIT_CONDITION';
export const SET_DEL_CONDITION = 'SET_DEL_CONDITION';


export const SET_COMBO_BOX_TIER = 'SET_COMBO_BOX_TIER';
export const SET_EDIT_CONDITION_TIER = 'SET_EDIT_CONDITION_TIER';
export const SET_DEL_CONDITION_TIER = 'SET_DEL_CONDITION_TIER';

export const SET_RULE_CONDITIONS = 'SET_RULE_CONDITIONS';
export const SET_TIER_CONDITIONS = 'SET_TIER_CONDITIONS';

export const SET_RULE_STATUS = 'SET_RULE_STATUS'

export const SET_EDIT_DOMAIN = 'SET_EDIT_DOMAIN'
export const SET_EDIT_PROFILE = 'SET_EDIT_PROFILE'
export const SET_EDIT_TIER = 'SET_EDIT_TIER'
export const SET_EDIT_RULE = 'SET_EDIT_RULE'

export const SET_DEL_ROLE = 'SET_DEL_ROLE'

export const SET_ADD_DOMAIN = 'SET_ADD_DOMAIN'

export const setAddDomain = addDomain =>({
    type:SET_ADD_DOMAIN,
    addDomain,
})

export const setDelRole = delRole =>({
    type:SET_DEL_ROLE,
    delRole,
})

export const setAllEvents = allEvents =>({
    type:SET_ALL_EVENTS,
    allEvents,
})

export const setEditRule = editRule =>({
    type:SET_EDIT_RULE,
    editRule,
})

export const setEditTier = editTier=>({
    type:SET_EDIT_TIER,
    editTier,
})

export const setEditDomain = editDomain=>({
    type:SET_EDIT_DOMAIN,
    editDomain,
})

export const setEditProfile = editProfile=>({
    type:SET_EDIT_PROFILE,
    editProfile,
})

export const setRuleStatus = ruleStatus =>({
    type: SET_RULE_STATUS,
    ruleStatus,
})

export const setDelRule = delRule =>({
    type: SET_DEL_RULE,
    delRule,
})

export const setDelTier = delTier => ({
    type: SET_DEL_TIER,
    delTier
});


export const setRuleConditions = ruleConditions => ({
    type: SET_RULE_CONDITIONS,
    ruleConditions
});

export const setTierConditions = tierConditions => ({
    type: SET_TIER_CONDITIONS,
    tierConditions
});

export const setComboBox = comboBox => ({
    type: SET_COMBO_BOX,
    comboBox
});

export const setComboBoxTier = comboBoxTier => ({
    type: SET_COMBO_BOX_TIER,
    comboBoxTier
});

export const setCurrentEvent = currentEvent => ({
    type: SET_CURRENT_EVENT,
    currentEvent
});


export const setDelDomain = delDomain => ({
    type: SET_DEL_DOMAIN,
    delDomain
});


export const setDelProfile = delProfile => ({
    type: SET_DEL_PROFILE,
    delProfile
});

export const setEditCondition = editCondition => ({
    type: SET_EDIT_CONDITION,
    editCondition
});

export const setDelCondition = delCondition => ({
    type: SET_DEL_CONDITION,
    delCondition
});

export const setEditConditionTier = editConditionTier => ({
    type: SET_EDIT_CONDITION_TIER,
    editConditionTier
});

export const setDelConditionTier = delConditionTier => ({
    type: SET_DEL_CONDITION_TIER,
    delConditionTier
});

export default function reducer(state = {
        allEvents:{},
        currentEvent:{},
        comboBox:{},
        comboBoxTier:{},
        delDomain:'',
        delProfile:{},
        delTier:{},
        delRule:{},
        editCondition:{},
        delCondition:'',
        editConditionTier:{},
        delConditionTier:'',
        ruleConditions:[],
        tierConditions:[],
        ruleStatus:{},
        editDomain:{},
        editProfile:{},
        editTier:{},
        editRule:{},
        delRole:{},
        addDomain:[],
}, action) {
    switch (action.type) {
        case SET_ADD_DOMAIN:
            return{
                ...state,
                addDomain:action.addDomain,
            };
        case SET_DEL_ROLE:
            return{
                ...state,
                delRole:action.delRole,
            };
        case SET_ALL_EVENTS:
            return{
                ...state,
                allEvents:action.allEvents,
            };
        case SET_EDIT_RULE:
            return{
                ...state,
                editRule:action.editRule,
            };
        case SET_EDIT_TIER:
            return {
                ...state,
                editTier: action.editTier
            };
        case SET_EDIT_DOMAIN:
            return {
                ...state,
                editDomain: action.editDomain
            };
        case SET_EDIT_PROFILE:
            return {
                ...state,
                editProfile: action.editProfile
            };
        case SET_RULE_STATUS:
            return {
                ...state,
                ruleStatus: action.ruleStatus
            };
        case SET_DEL_RULE:
        return {
            ...state,
            delRule: action.delRule
        };
        case SET_DEL_TIER:
        return {
            ...state,
            delTier: action.delTier
        };

        case SET_RULE_CONDITIONS:
        return {
            ...state,
            ruleConditions: action.ruleConditions
        };
        case SET_TIER_CONDITIONS:
        return {
            ...state,
            tierConditions: action.tierConditions,
        };
        case SET_DEL_CONDITION_TIER:
        return {
            ...state,
            delConditionTier: action.delConditionTier
        };
        case SET_EDIT_CONDITION_TIER:
                return {
                    ...state,
                    editConditionTier: action.editConditionTier
                };
        case SET_DEL_CONDITION:
        return {
            ...state,
            delCondition: action.delCondition
        };
        case SET_EDIT_CONDITION:
                return {
                    ...state,
                    editCondition: action.editCondition
                };
        case SET_DEL_PROFILE:
                return {
                    ...state,
                    delProfile: action.delProfile
                };
        case SET_DEL_DOMAIN:
                return {
                    ...state,
                    delDomain: action.delDomain
                };
        case SET_COMBO_BOX:
                return {
                    ...state,
                    comboBox: action.comboBox
                };
        case SET_COMBO_BOX_TIER:
                    return {
                        ...state,
                        comboBoxTier: action.comboBoxTier
                    };

        case SET_CURRENT_EVENT:
            return {
                    ...state,
                    currentEvent: action.currentEvent
             };
        default:
            return state;
    }
}