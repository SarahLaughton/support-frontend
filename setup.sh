#!/usr/bin/env bash
set -e

readonly SYSTEM=$(uname -s)
EXTRA_STEPS=()

linux() {
  [[ ${SYSTEM} == 'Linux' ]]
}

mac() {
  [[ ${SYSTEM} == 'Darwin' ]]
}

installed() {
  hash "$1" 2>/dev/null
}

nvm_installed() {
  if [ -d '/usr/local/opt/nvm' ] || [ -d "$HOME/.nvm" ]; then
    true
  else
    false
  fi
}

nvm_available() {
  type -t nvm > /dev/null
}

source_nvm() {
  if ! nvm_available; then
    [ -e "/usr/local/opt/nvm/nvm.sh" ] && source /usr/local/opt/nvm/nvm.sh
  fi
  if ! nvm_available; then
    [ -e "$HOME/.nvm/nvm.sh" ] && source $HOME/.nvm/nvm.sh
  fi
}

check_encryption() {
  if linux; then
    EXTRA_STEPS+=("Sorry, can't check if your hard disk is encrypted - please ensure that it is! (applies to both portable and Desktop machines)")
  elif mac; then
    if [[ "$(fdesetup status)" != "FileVault is On." ]]; then
      EXTRA_STEPS+=("your hard disk is not encrypted! Encryption must be enabled on all guardian machines. Follow these instructions: https://support.apple.com/en-gb/HT204837")
    fi
  fi
}

create_aws_config() {
  local path="$HOME/.aws"
  local filename="config"

  if [[ ! -f "$path/$filename" ]]; then
    if [[ ! -d "$path" ]]; then
      mkdir "$path"
    fi

    echo "[profile membership]
region = eu-west-1" > "$path/$filename"
  fi
}

install_homebrew() {
  if mac && ! installed brew; then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  fi
}

install_jdk() {
  if ! installed javac; then
    if linux; then
      sudo apt-get install -y openjdk-8-jdk
    elif mac; then
      EXTRA_STEPS+=("Download the JDK from http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html")
    fi
  fi
}

install_node() {
  if ! nvm_installed; then
    if linux; then
      if ! installed curl; then
        sudo apt-get install -y curl
      fi
    fi

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
    nvm install
    EXTRA_STEPS+=("Add https://git.io/vKTnK to your .bash_profile")
  else
    if ! nvm_available; then
      source_nvm
    fi
    nvm install
  fi
}

install_nginx() {
  if ! installed nginx; then
    brew install nginx
  fi
}

install_awscli() {
  if ! installed aws; then
    brew install awscli
  fi
}

install_sbt() {
  if ! installed sbt; then
    brew install sbt@1
  fi
}

install_yarn() {
  npm install -g yarn
}

install_js_deps() {
  yarn install
}

report() {
  if [[ ${#EXTRA_STEPS[@]} -gt 0 ]]; then
    for i in "${!EXTRA_STEPS[@]}"; do
      echo "  $((i+1)). ${EXTRA_STEPS[$i]}"
    done
  fi
}

main () {
  check_encryption
  create_aws_config
  install_homebrew
  install_nginx
  install_awscli
  install_jdk
  install_sbt
  install_node
  install_js_deps
  report
}

main
