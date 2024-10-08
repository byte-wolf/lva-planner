{ pkgs ? import <nixpkgs> { } }:
let
  nodejs = pkgs.nodejs_20;
  bun = pkgs.bun;
in
pkgs.stdenv.mkDerivation {
  name = "my-shell";
  packages = [  ];
  shellHook = ''
    bun i
  '';
  buildInputs = [ nodejs bun ];
}