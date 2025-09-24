class NameSpaceManager {
  constructor(io) {
    this.io = io;
    this.userNamespaces = new Map();
    this.driverNamespaces = new Map();
  }

  _createNamespace(namespacePath, namespaceMap) {
    const namespace = this.io.of(namespacePath);
    namespaceMap.set(namespacePath.split("/")[2], namespace); // User/Driver ID is the third segment
    return namespace;
  }

  createUserNamespace(userId) {
    return this._createNamespace(
      `/userNamespace/${userId}`,
      this.userNamespaces,
    );
  }

  createDriverNamespace(driverId) {
    return this._createNamespace(
      `/driverNamespace/${driverId}`,
      this.driverNamespaces,
    );
  }

  getUserNamespace(userId) {
    return this.userNamespaces.get(userId);
  }

  getDriverNamespace(driverId) {
    return this.driverNamespaces.get(driverId);
  }

  getAllConnectedDrivers() {
    return Array.from(this.driverNamespaces.values());
  }

  getAllConnectedUsers() {
    return Array.from(this.userNamespaces.entries())
      .filter(([, namespace]) => namespace.connected)
      .map(([userId]) => userId);
  }

  _disconnectNamespace(namespaceMap, id) {
    const namespace = namespaceMap.get(id);
    if (namespace) {
      namespace.sockets.forEach((socket) => socket.disconnect(true));
      // namespace.delete(id);
    }
  }

  disconnectUserNamespace(userId) {
    this._disconnectNamespace(this.userNamespaces, userId);
  }

  disconnectDriverNamespace(driverId) {
    this._disconnectNamespace(this.driverNamespaces, driverId);
  }

  _destroyNamespace(namespaceMap, id) {
    this._disconnectNamespace(namespaceMap, id);
    const namespace = namespaceMap.get(id);
    if (namespace) {
      namespace.removeAllListeners();
      // namespaceMap.delete(id);
    }
  }

  destroyUserNamespace(userID) {
    this._destroyNamespace(this.userNamespaces, userID);
  }

  destroyDriverNamespace(driverID) {
    this._destroyNamespace(this.driverNamespaces, driverID);
  }
}

export default NameSpaceManager;
