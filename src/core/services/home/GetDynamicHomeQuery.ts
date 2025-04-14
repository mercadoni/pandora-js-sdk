const getDynamicHomeQuery = `query Query($getDynamicHomeInput: GetDynamicHomeInput!) {
            getDynamicHome(getDynamicHomeInput: $getDynamicHomeInput)
        }`

export default getDynamicHomeQuery;