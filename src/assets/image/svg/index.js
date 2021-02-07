const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./icon', false, /\.svg$/)
requireAll(req)
