mod utils;

use wasm_bindgen::prelude::*;

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
pub fn greet() {
    alert("Hello, geo-www!");
}

use geo::{Polygon, Geometry, Point, MultiPoint};
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