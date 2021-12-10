mod utils;

use wasm_bindgen::prelude::*;

use std::convert::TryFrom;
use log::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    // TODO separate log setup from panic hook
    wasm_logger::init(wasm_logger::Config::default());
    console_error_panic_hook::set_once();
}

use geo::{Polygon, Point, MultiPoint, GeometryCollection};
use geojson::GeoJson;

use wasm_bindgen::JsValue;
mod internal {
    use super::*;
    pub fn points_of_interest() -> Vec<Point<f64>> {
        // Glendale peak
        let glendale_peak = Point::<f64>::new(-118.2879087, 34.1246495);
        let bee_rock = Point::new(-118.2935174, 34.1343900);
        let beacon_hill = Point::new(-118.2773421, 34.1284912);

        let points = vec![glendale_peak, bee_rock, beacon_hill];
        points
    }

    pub fn convex_hull_of_interest() -> Polygon<f64> {
        use geo::algorithm::convex_hull::ConvexHull;
        let multipoint = geo::MultiPoint(points_of_interest());
        multipoint.convex_hull()
    }
}

#[wasm_bindgen]
pub fn points_of_interest() -> JsValue {
    use std::iter::FromIterator;

    let geo_json = GeoJson::from_iter(&internal::points_of_interest());
    JsValue::from_serde(&geo_json).unwrap()
}

#[wasm_bindgen]
pub fn convex_hull_of_interest() -> JsValue {
    let geo_json = GeoJson::from(&internal::convex_hull_of_interest());
    JsValue::from_serde(&geo_json).unwrap()
}

#[derive(Debug)]
struct Error(String);

impl From<String> for Error {
    fn from(err: String) -> Self {
        Self(err)
    }
}

// TODO: move something like this into geo_types?
fn geometry_collection_into_multipoint<T: geo::CoordNum>(collection: geo::GeometryCollection<T>) -> Result<MultiPoint<T>, Error> {
    let mut points: Vec<Point<T>> = vec![];
    for geometry in collection {
        // let collection = GeometryCollection::try_from(geometry).map_err(|e| format!("{:?}", e))?;
        // let collection = GeometryCollection::try_from(collection.0.get(0).unwrap().clone()).map_err(|e| format!("{:?}", e))?;
        // let collection = GeometryCollection::try_from(collection.0.get(0).unwrap().clone()).map_err(|e| format!("{:?}", e))?;
        let point = Point::try_from(geometry).map_err(|e| format!("{:?}", e))?;
        points.push(point);
    }
    Ok(MultiPoint(points))
}

#[wasm_bindgen]
pub fn convex_hull(input: JsValue) -> JsValue {
    let input: GeoJson = input.into_serde().expect("invalid geojson");
    use std::convert::TryFrom;
    let input_geom =  geo::Geometry::<f64>::try_from(input).expect("invalid geometry");

    let collection = if let geo::Geometry::GeometryCollection(collection) = input_geom {
        collection
    } else {
        panic!("invalid geometry collection");
    };

    let multi_point = geometry_collection_into_multipoint(collection).expect("invalid multipoint");

    use geo::algorithm::convex_hull::ConvexHull;
    let hull = multi_point.convex_hull();

    let output_geojson = GeoJson::from(&hull);
    JsValue::from_serde(&output_geojson).expect("invalid js value")
}