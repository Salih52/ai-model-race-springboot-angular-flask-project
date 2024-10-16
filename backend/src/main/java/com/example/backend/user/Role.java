package com.example.backend.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum Role {

    USER(
            Set.of(
                    Permissions.USER_CREATE,
                    Permissions.USER_DELETE,
                    Permissions.USER_READ,
                    Permissions.USER_UPDATE
            )
    )


    ,

    ADMIN(
            Set.of(
                    Permissions.USER_CREATE,
                    Permissions.USER_DELETE,
                    Permissions.USER_READ,
                    Permissions.USER_UPDATE,
                    Permissions.ADMIN_CREATE,
                    Permissions.ADMIN_DELETE,
                    Permissions.ADMIN_READ,
                    Permissions.ADMIN_UPDATE
            )
    )
    ;

    @Getter
    private final Set<Permissions> permissions;

    public List<SimpleGrantedAuthority> getAuthorities(){
        var authorities = new java.util.ArrayList<>(getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
