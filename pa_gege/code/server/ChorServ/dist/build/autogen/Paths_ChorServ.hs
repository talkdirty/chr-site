module Paths_ChorServ (
    version,
    getBinDir, getLibDir, getDataDir, getLibexecDir,
    getDataFileName
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
catchIO = Exception.catch


version :: Version
version = Version {versionBranch = [0,1], versionTags = []}
bindir, libdir, datadir, libexecdir :: FilePath

bindir     = "/home/svt/.cabal/bin"
libdir     = "/home/svt/.cabal/lib/ChorServ-0.1/ghc-7.6.3"
datadir    = "/home/svt/.cabal/share/ChorServ-0.1"
libexecdir = "/home/svt/.cabal/libexec"

getBinDir, getLibDir, getDataDir, getLibexecDir :: IO FilePath
getBinDir = catchIO (getEnv "ChorServ_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "ChorServ_libdir") (\_ -> return libdir)
getDataDir = catchIO (getEnv "ChorServ_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "ChorServ_libexecdir") (\_ -> return libexecdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
