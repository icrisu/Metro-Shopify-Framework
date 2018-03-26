#!/bin/bash
SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cd '../front'
echo "COMPILE FRONTEND ASSETS >>>>>>"
npm run build

cd '../storefront'
echo "COMPILE STOREFRONTEND ASSETS >>>>>>"
npm run build

cd '../server'
echo "COMPILE SERVER >>>>>> "
npm run build