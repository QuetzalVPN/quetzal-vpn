package dev.quetzalvpn.models

import org.jetbrains.exposed.dao.Entity
import org.jetbrains.exposed.dao.EntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

class LoginUser(id: EntityID<Int>) : Entity<Int>(id) {
    companion object : EntityClass<Int, LoginUser>(LoginUsers)

    var loginName by LoginUsers.loginName
    var passwordHash by LoginUsers.passwordHash

    val logs by LoginLog referrersOn LoginLogs.loginUserId
}

object LoginUsers : IntIdTable() {
    val loginName = varchar("loginName", 100).uniqueIndex()
    val passwordHash = varchar("passwordHash", 512)
}
