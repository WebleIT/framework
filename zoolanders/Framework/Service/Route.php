<?php

namespace Zoolanders\Service;

use Zoolanders\Container\Container;

class Route extends Service
{
    public function __construct(Container $c)
    {
        parent::__construct($c);

        $this->setupRouters();
    }

    /**
     *  Setup the custom routers for each application
     */
    protected function setupRouters()
    {
        $this->container->zoo->getApp()->event->dispatcher->connect('application:sefparseroute', function ($event) {

            $app_id = $this->app->request->getInt('app_id', null);
            $app = $this->app->table->application->get($app_id);

            // check if was loaded
            if (!$app) return;

            $group = $app->getGroup();
            if ($router = $this->app->path->path("applications:$group/router.php")) {

                require_once $router;

                $class = 'ZLRouter' . ucfirst($group);
                $routerClass = new $class;
                $routerClass->parseRoute($event);
            }
        });
    }
}