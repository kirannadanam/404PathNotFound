# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import osmnx as ox
# import networkx as nx

# import geopandas as gpd

# # allow the python to take requests from the app.tsx
# app = Flask(__name__)
# CORS(app)

# # take data from roads.shp and make it into a graph
# shapefile_path = "./public/roads.shp"
# gdf = gpd.read_file(shapefile_path)
# # graphifying (idk if thats a word) WE SHOULD CHANGE THIS TO MAKE THE GRAPH MANUALLY (more learning)
# G = ox.graph_from_gdfs(gdf, gdf)

# #for seeing data
# # print(gdf.head())  
# # print(gdf.columns)  
# # print(gdf.crs)  
# # print(gdf.geometry)  

# @app.route("/")
# def home():
#     return "flask works happy times"

# @app.route("/shortest-path", methods=["POST"])
# def shortest_path():
#     try:
#         #take the data from App.tsx to use later
#         data = request.json
#         point1 = tuple(data["point1"])
#         point2 = tuple(data["point2"])

#         # finds the nearest nodes using the two points
#         node1 = ox.distance.nearest_nodes(G, point1[1], point1[0])
#         node2 = ox.distance.nearest_nodes(G, point2[1], point2[0])

#         # get shortest path *****WE NEED TO MAKE THIS OURSELVES AND USING THE SPECIFIED ALGORITHM*****
#         path = nx.shortest_path(G, node1, node2, weight="length")

#         # get coordinates of path
#         path_coords = [(G.nodes[n]["y"], G.nodes[n]["x"]) for n in path]

#         #return path coordinates in a format that leaflet drawing can understand
#         return jsonify({"path": path_coords})

#     #error handling
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# #run flash server
# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import networkx as nx
import geopandas as gpd
from shapely.geometry import LineString, Point
from scipy.spatial import KDTree

app = Flask(__name__)
CORS(app)

# Load the road shapefile
shapefile_path = "./public/roads.shp"
gdf = gpd.read_file(shapefile_path)


# for seeing data
print(gdf.head())  
print(gdf.columns)  
print(gdf.crs)  
print(gdf.geometry)  

# make sure the units used are the same.
if gdf.crs is None:
    gdf.set_crs(epsg=4326, inplace=True)
gdf = gdf.to_crs(epsg=4326)

# Create an empty NetworkX graph
G = nx.Graph()

# Extract road segment endpoints and add to graph
nodes = set()
edges = []

for _, row in gdf.iterrows():
    if isinstance(row.geometry, LineString):
        coords = list(row.geometry.coords)
        for i in range(len(coords) - 1):
            node1, node2 = tuple(coords[i]), tuple(coords[i+1])
            nodes.add(node1)
            nodes.add(node2)
            distance = Point(node1).distance(Point(node2))  # Euclidean distance
            G.add_edge(node1, node2, weight=distance)

# Convert node list to KDTree for fast nearest neighbor lookup
node_list = list(nodes)
kdtree = KDTree(node_list)

def find_nearest_node(point):
    """Find the nearest graph node to a given lat/lon point."""
    print(f"Querying for point: {point.x}, {point.y}")  # Debugging log
    _, index = kdtree.query((point.x, point.y))  # Coordinates as (lon, lat)
    nearest_node = node_list[index]
    print(f"Found nearest node: {nearest_node}")  # Debugging log
    return nearest_node

@app.route("/")
def home():
    return "flask works happy times"

@app.route("/shortest-path", methods=["POST"])
def shortest_path():
    try:
        data = request.json
        point1 = tuple(data["point1"])
        point2 = tuple(data["point2"])

        # Find nearest nodes
        node1 = find_nearest_node(Point(point1[1], point1[0]))
        node2 = find_nearest_node(Point(point2[1], point2[0]))

        print(f"Nearest nodes: {node1} and {node2}")  # Debugging log

        # Compute shortest path
        path = nx.shortest_path(G, node1, node2, weight="weight")

        print(f"Shortest path: {path}")  # Debugging log

        # Convert path nodes to lat/lon
        path_coords = [[p[1], p[0]] for p in path]  # Convert to [lat, lon]

        return jsonify({"path": path_coords})

    except Exception as e:
        print("Error:", str(e))  # Debugging log
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
