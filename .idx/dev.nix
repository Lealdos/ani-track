{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.bun
  ];
  
  services.docker.enable = true;
  idx.extensions = [
    
  
 "bradlc.vscode-tailwindcss"
 "dbaeumer.vscode-eslint"
 "eamodio.gitlens"
 "esbenp.prettier-vscode"
 "formulahendry.auto-rename-tag"
 "manuth.eslint-language-service"
 "PKief.material-icon-theme"
 "streetsidesoftware.code-spell-checker"];
  # idx.previews = {
  #   previews = {
  #     web = {
  #       command = [
  #         "bun"
  #         "dev"
  #         "--"
  #         "--port"
  #         "$PORT"
  #         "--hostname"
  #         "0.0.0.0"
  #       ];
  #       manager = "web";
  #     };
  #   };
  # };
}