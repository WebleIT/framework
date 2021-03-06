<?php

namespace Zoolanders\Framework\Event;

use Zoolanders\Framework\Event\Element\Beforedisplay;

class Zoo
{
    /**
     * @var \EventHelper
     */
    public $zoo;

    /**
     * Event constructor.
     */
    public function __construct (Dispatcher $dispatcher, \Zoolanders\Framework\Service\Zoo $zoo)
    {
        $this->dispatcher = $dispatcher;
        $this->zoo = $zoo->event;
        $this->proxyAllZooEvents();
    }

    /**
     * Proxy any zoo event to a zoolanders event
     */
    protected function proxyAllZooEvents ()
    {
        // first, get any know zoo event
        $zooDispatcher = new \ReflectionClass($this->zoo->dispatcher);
        $property = $zooDispatcher->getProperty('listeners');
        $property->setAccessible(true);
        $listeners = $property->getValue($this->zoo->dispatcher);

        // Some extra events
        $listeners['item:init'] = [];
        $listeners['item:save'] = [];
        $listeners['category:init'] = [];
        $listeners['submission:init'] = [];
        $listeners['element:afteredit'] = [];
        $listeners['element:configform'] = [];
        $listeners['element:configparams'] = [];
        $listeners['element:beforedisplay'] = [];
        $listeners['element:beforesubmissiondisplay'] = [];
        $listeners['type:coreconfig'] = [];
        $listeners['type:aftersave'] = [];
        $listeners['application:init'] = [];
        $listeners['application:sefbuildroute'] = [];


        $listeners = array_keys($listeners);

        // Get the event name already registered in the zoo dispatcher
        foreach ($listeners as $eventName) {

            // proxy each event found
            $eventClass = $this->getEventObjectClass($eventName);

            if (class_exists($eventClass)) {
                $this->zoo->dispatcher->connect($eventName, function ($zooEvent) use ($eventClass) {

                    $event = $this->createEventObject($eventClass, $zooEvent);

                    if ($event) {
                        $event->setReturnValue($zooEvent->getReturnValue());
                        $this->dispatcher->trigger($event);
                        $zooEvent->setReturnValue($event->getReturnValue());
                    }
                });
            }
        }
    }

    /**
     * @param $eventName
     * @return string
     */
    protected function getEventObjectClass ($eventName)
    {
        // Separate resource from method
        $parts = explode(":", $eventName);
        $resource = @$parts[0];
        $event = @$parts[1];

        $resourceName = ucfirst(strtolower($resource));
        $eventName = ucfirst(strtolower($event));

        // First try a dedicated event class for this resource
        $eventClass = '\\Zoolanders\\Framework\\Event\\' . $resourceName . '\\' . $eventName;

        return $eventClass;
    }

    /**
     * Create the right Zoolanders event class instance from the zoo event
     * @param string $eventClass class to instantiate
     * @param \AppEvent $zooEvent The event itself
     * @return \Zoolanders\Framework\Event\Event|null
     */
    protected function createEventObject ($eventClass, \AppEvent $zooEvent)
    {
        $r = new \ReflectionClass($eventClass);

        // Create the list of the constructor arguments for the event class
        $parameters = [];
        if ($r->implementsInterface(HasSubjectInterface::class)) {
            $parameters[] = $zooEvent->getSubject();
        }

        // add any other paramenter
        foreach ($zooEvent->getParameters() as $key => &$value) {
            $parameters[] = &$value;
        }

        try {
            if ($zooEvent->getName() == 'element:beforedisplay' && !$parameters[2] instanceof \Element) {
                echo json_encode($zooEvent->getSubject());die();
            }
            $obj = $r->newInstanceArgs($parameters);
        } catch (\Exception $e) {
            return null;
        }

        return $obj;
    }

    /**
     * @param $name
     * @param $arguments
     * @return mixed
     */
    public function __call ($name, $arguments)
    {
        return call_user_func_array([$this->zoo->dispatcher, $name], $arguments);
    }

    /**
     * @param $name
     * @return mixed
     */
    public function __get ($name)
    {
        if ($name == 'dispatcher') {
            return $this->zoo->$name;
        } else {
            return $this->zoo->dispatcher->{$name};
        }
    }
}
