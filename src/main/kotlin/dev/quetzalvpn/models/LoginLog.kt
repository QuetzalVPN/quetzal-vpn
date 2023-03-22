package dev.quetzalvpn.models

import org.jetbrains.exposed.dao.Entity
import org.jetbrains.exposed.dao.EntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.datetime


class LoginLog(id: EntityID<Int>) : Entity<Int>(id) {
    companion object : EntityClass<Int, LoginLog>(LoginLogs)

    var loginDateTime by LoginLogs.loginDateTime
    var loginUser by LoginUser referencedOn LoginLogs.loginUserId
    var loginIp by LoginLogs.loginIp
    var loginResult by LoginLogs.loginResult
}

object LoginLogs : IntIdTable() {
    val loginDateTime = datetime("loginDateTime")
    val loginUserId = reference("loginUserId", LoginUsers)
    val loginIp = varchar("loginIp", 100)
    val loginResult = bool("loginResult")
}