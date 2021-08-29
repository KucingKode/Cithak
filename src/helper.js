exports.trim = (str) => {
   return str.replace(/\n {2,}/g, '\n')
}

exports.assignPackage = (localPackage, additionPackage) => {
   // merged
   const mergedDependencies = Object.assign(
      (localPackage.dependencies || {}),
      (additionPackage.dependencies || {})
   )
   const mergedDevDependencies = Object.assign(
      (localPackage.devDependencies || {}),
      (additionPackage.devDependencies || {})
   )

   // join dependencies
   Object.keys(mergedDependencies) > 0 ?
      localPackage.dependencies = mergedDependencies : ''
   Object.keys(mergedDevDependencies) > 0 ?
      localPackage.devDependencies = mergedDevDependencies : ''

   return JSON.stringify(localPackage, null, 2)
}