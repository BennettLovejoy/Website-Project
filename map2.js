//I am not sure if this needs to be in an entirely separate file
// but in an attempt to keep my workspaces tidy, here is a new file 
// for the functions that will load the various state and school
// district boundaries.


const usStates = L.layerGroup();
const usCounties = L.layerGroup();
const ohioSchoolDistricts = L.layerGroup();
const ohioPublicUseMicroData = L.layerGroup();
const ohioPlaces = L.layerGroup();
const ohioCensusTracts = L.layerGroup();
const ohioBlockGroups = L.layerGroup();
const ohioBlocks = L.layerGroup();

try{
    L.shapeFile('data/geographic-data/us-states/tl_2023_us_state.shp',{
        color: 'red',
        weight: 2,
        opacity: 0.5
    }).addTo(usStates);
} catch(err) {
    console.error('Error loading Shapefile:', err);
}



L.shapeFile('data/geographic-data/us-counties/tl_2023_us_county.shp').addTo(usCounties);
L.shapeFile('data/geographic-data/ohio-school-districts/tl_2023_39_unsd.shp').addTo(ohioSchoolDistricts);
L.shapeFile('data/geographic-data/ohio-public-use-microdata-areas/tl_2023_39_puma20.shp').addTo(ohioPublicUseMicroData);
L.shapeFile('data/geographic-data/ohio-places/tl_2023_39_place.shp').addTo(ohioPlaces);
L.shapeFile('data/geographic-data/ohio-census-tracts/tl_2023_39_tract.shp').addTo(ohioCensusTracts);
L.shapeFile('data/geographic-data/ohio-block-groups/tl_2023_39_bg.shp').addTo(ohioBlockGroups);
L.shapeFile('data/geographic-data/ohio-blocks/tl_2023_39_tabblock20.shp').addTo(ohioBlocks);

const layerControl = L.control.layers({
    'US States': usStates,
    'US Counties': usCounties,
    'Ohio School Districts': ohioSchoolDistricts,
    'Microdata?': ohioPublicUseMicroData,
    'Ohio Place Names': ohioPlaces,
    'Ohio Census Tracts': ohioCensusTracts,
    'Ohio Blocks': ohioBlocks,
    'Ohio Block Groups': ohioBlockGroups
}).addTo(map);
