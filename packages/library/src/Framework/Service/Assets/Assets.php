<?php

namespace Zoolanders\Framework\Service\Assets;

use Assetic\AssetManager;
use Assetic\Factory\AssetFactory;
use Assetic\Factory\Worker\CacheBustingWorker;
use Assetic\FilterManager;
use Zoolanders\Framework\Container\Container;
use Zoolanders\Framework\Service\Filesystem;
use Zoolanders\Framework\Service\Path;
use Zoolanders\Framework\Service\Service;
use Zoolanders\Framework\Service\System\Document;

abstract class Assets
{
    /**
     * @var AssetManager
     */
    protected $assetManager;

    /**
     * @var FilterManager
     */
    protected $filterManager;

    /**
     * @var AssetFactory
     */
    protected $factory;

    /**
     * @var Document
     */
    protected $document;

    /**
     * @var Path
     */
    protected $path;

    /**
     * @var Filesystem
     */
    protected $filesystem;

    /**
     * @var array
     */
    protected $filters = [];

    /**
     * @var
     */
    protected $assets = [];

    /**
     * Assets constructor.
     * @param Document $document
     * @param Path $path
     * @param Filesystem $fs
     */
    public function __construct (Document $document, Path $path, Filesystem $fs)
    {
        $this->assetManager = new AssetManager();
        $this->filterManager = new FilterManager();
        $this->factory = new AssetFactory(JPATH_SITE);

        $this->factory->setAssetManager($this->assetManager);
        $this->factory->setFilterManager($this->filterManager);
        $this->factory->addWorker(new CacheBustingWorker());

        $this->document = $document;
        $this->path = $path;
        $this->filesystem = $fs;
    }

    /**
     * Define an asset with a name
     * @param $name
     * @param $assets
     */
    public function define ($name, $assets)
    {
        settype($assets, 'array');
        $this->assetManager->set($name, $this->factory->createAsset($assets));
    }

    /**
     * Add a list of assets to be loaded
     *
     * @param array $assets
     */
    public function add ($assets)
    {
        settype($assets, 'array');

        foreach ($assets as &$asset) {
            $asset = $this->path->path($asset);
        }

        $this->assets = array_unique(array_merge($this->assets, $assets));
    }

    /**
     * Load the asset files in the browser
     * @param bool $filters
     */
    public function load ($filters = false)
    {
        if (count($this->assets) <= 0) {
              return;
        }

        if (!$filters) {
            $filters = $this->filters;
        }

        $asset = $this->factory->createAsset($this->assets, $filters, [
            'name' => $this->getAssetName($this->assets, $filters)
        ]);

        $writer = new Writer($this->filesystem, JPATH_CACHE . '/zoolanders/');
        $writer->writeAsset($asset);

        foreach ($writer->getPaths() as $path) {
            $this->loadFile($path);
        }
    }

    /**
     * @param $path
     * @return mixed
     */
    abstract protected function loadFile ($path);

    /**
     * @return string
     */
    abstract protected function getAssetName();
}
