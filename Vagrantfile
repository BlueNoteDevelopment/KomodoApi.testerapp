# Fix permissions after you run commands on both hosts and guest machine
system("
    if [ #{ARGV[0]} = 'up' ]; then
        echo 'Setting world write permissions for ./logs/*'
        chmod a+w ./logs
        chmod a+w ./logs/*
    fi
")

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "testerapp" do |testerapp|
      testerapp.vm.box = "puppetlabs/centos-7.0-64-nocm"
      testerapp.vm.network "private_network", ip: "192.168.50.54"
      testerapp.vm.box_download_insecure = true

      testerapp.vm.provider :virtualbox do |v|
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        v.customize ["modifyvm", :id, "--memory", 512]
        v.customize ["modifyvm", :id, "--name", "testerapp"]
      end

      if Vagrant.has_plugin?("vagrant-cachier")
          web.cache.scope = :box
      end

      # Install all needed packages
      testerapp.vm.provision "shell", name: "rpm", inline: <<-SHELL
        rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
        rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
      SHELL

      # PHP and modules
      testerapp.vm.provision "shell", name: "php", inline: <<-SHELL
        sudo yum -y install php70w php70w-opcache
        sudo yum -y install mod_ssl
        sudo yum -y install vim
      SHELL

      # Update Apache config and restart
      testerapp.vm.provision "shell", name: "apache", inline: <<-'SHELL'
        # Set DocumentRoot in Apache config file to the project files where it is shared in /vagrant
        echo "Setting Apache's DocumentRoot"
        sed -i 's/^DocumentRoot .*/DocumentRoot "\/vagrant"/g' /etc/httpd/conf/httpd.conf
        sed -i 's/\/var\/www\/html/\/vagrant/g' /etc/httpd/conf/httpd.conf

        # Set ServerName in Apache config file to localhost
        echo "Setting Apache's ServerName"
        sed -i 's/^#ServerName .*/ServerName localhost/g' /etc/httpd/conf/httpd.conf

        # Set AllowOverride in all directory settings in Apache config to enable .htaccess
        echo "Setting Apache's AllowOverride"
        sed -i 's/^\s*AllowOverride .*/AllowOverride All/g' /etc/httpd/conf/httpd.conf

        # Disable apache sendfile to fix "cache" when serving static files
        echo "Disable Apache's sendfile"
        sed -i 's/^#EnableSendfile off/EnableSendfile off/g' /etc/httpd/conf/httpd.conf
        sed -i 's/^EnableSendfile on/EnableSendfile off/g' /etc/httpd/conf/httpd.conf

        # Register Apache as a service
        echo "Registering Apache as a service"
        sudo systemctl enable httpd.service

        # Start Apache service
        echo "Starting Apache Service"
        sudo systemctl restart httpd.service
      SHELL

      # Stop iptable because it will cause too much confusion
      testerapp.vm.provision "shell", name: "iptables", inline: <<-SHELL
        sudo systemctl stop firewalld.service
        sudo systemctl disable firewalld.service
      SHELL
    end
end
